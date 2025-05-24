from flask import Blueprint, request, jsonify
from backend.db_config import db
from models import Transaction, Category, Budget  # Make sure Budget is imported
from datetime import datetime

trans_bp = Blueprint('trans', __name__)

# Add a transaction
@trans_bp.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()
    transaction = Transaction(
        user_id=data['user_id'],
        category_id=data['category_id'],
        amount=data['amount'],
        date=datetime.strptime(data['date'], "%Y-%m-%d"),
        description=data['description']
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction added"}), 201

# Get all transactions for a user with category names
@trans_bp.route('/transactions/<int:user_id>', methods=['GET'])
def get_transactions(user_id):
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    result = []
    for t in transactions:
        category = Category.query.get(t.category_id)
        result.append({
            "id": t.id,
            "amount": t.amount,
            "date": t.date.strftime("%Y-%m-%d"),
            "description": t.description,
            "category": category.name if category else "Unknown"
        })
    return jsonify(result), 200

# Get all categories
@trans_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories]), 200

# Set budget per category
@trans_bp.route('/budget', methods=['POST'])
def set_budget():
    data = request.get_json()
    budget = Budget(
        user_id=data['user_id'],
        category_id=data['category_id'],
        amount=data['amount']
    )
    db.session.add(budget)
    db.session.commit()
    return jsonify({"message": "Budget set!"}), 201

# Get user budgets
@trans_bp.route('/budget/<int:user_id>', methods=['GET'])
def get_budgets(user_id):
    budgets = Budget.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "category_id": b.category_id,
            "amount": b.amount
        } for b in budgets
    ]), 200

# Get budget usage summary
@trans_bp.route('/budget-usage/<int:user_id>', methods=['GET'])
def get_budget_usage(user_id):
    budgets = Budget.query.filter_by(user_id=user_id).all()
    results = []

    for b in budgets:
        category = Category.query.get(b.category_id)
        total_spent = db.session.query(db.func.sum(Transaction.amount))\
            .filter_by(user_id=user_id, category_id=b.category_id)\
            .filter(Transaction.amount < 0).scalar() or 0
        results.append({
            "category": category.name if category else "Unknown",
            "budget": b.amount,
            "spent": abs(total_spent),
            "remaining": b.amount - abs(total_spent)
        })

    return jsonify(results), 200

# Delete a transaction
@trans_bp.route('/transactions/<int:trans_id>', methods=['DELETE'])
def delete_transaction(trans_id):
    trans = Transaction.query.get(trans_id)
    if not trans:
        return jsonify({"message": "Transaction not found"}), 404
    db.session.delete(trans)
    db.session.commit()
    return jsonify({"message": "Transaction deleted!"}), 200
