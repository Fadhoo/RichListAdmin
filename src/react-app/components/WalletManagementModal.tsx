import { useState, useEffect } from "react";
import { X, Plus, Minus, Wallet, TrendingUp, TrendingDown, DollarSign, Clock, User, FileText } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
// import User from "../types/users";

interface UserWithWallet {
  _id: string;
  email: string;
  
  walletId?: {
    _id: number;
    balance: number;
    currency: string;
    is_active: boolean;
  };
}

interface WalletTransaction {
  _id: number;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  currency: string;
  description: string;
  processed_by: string;
  created_at: string;
}

interface WalletManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithWallet | null;
  onWalletUpdate: () => void;
}

export default function WalletManagementModal({
  isOpen,
  onClose,
  user,
  onWalletUpdate,
}: WalletManagementModalProps) {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({
    amount: '',
    transaction_type: 'deposit' as 'deposit' | 'withdrawal' | 'adjustment',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isOpen && user) {
      fetchWalletData();
      fetchTransactions(1);
    }
  }, [isOpen, user]);

  const fetchWalletData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user._id}/wallet`, {
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setWallet(result.wallet);
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page: number) => {
    if (!user) return;
    
    setTransactionsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user._id}/wallet/transactions?page=${page}&limit=10`, {
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setTransactions(result.transactions);
        setCurrentPage(result.pagination.page);
        setTotalPages(result.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!adjustmentData.amount || !adjustmentData.description) {
      setErrors({ form: 'Please fill in all required fields' });
      return;
    }

    const amount = parseFloat(adjustmentData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors({ amount: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user?._id}/wallet/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: adjustmentData.transaction_type === 'withdrawal' ? -amount : amount,
          transaction_type: adjustmentData.transaction_type,
          description: adjustmentData.description,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setWallet(result.wallet);
        setAdjustmentData({
          amount: '',
          transaction_type: 'deposit',
          description: '',
        });
        fetchTransactions(1); // Refresh transactions
        onWalletUpdate(); // Refresh parent data
      } else {
        const error = await response.json();
        setErrors({ form: error.error || 'Failed to adjust wallet' });
      }
    } catch (error) {
      console.error('Failed to adjust wallet:', error);
      setErrors({ form: 'Failed to adjust wallet' });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'withdrawal':
      case 'payment':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return 'text-green-600';
      case 'withdrawal':
      case 'payment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTransactionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Wallet Management</h2>
                <p className="text-sm text-gray-600">{user.google_user_data.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.form}
            </div>
          )}

          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Balance</h3>
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <p className="text-3xl font-bold text-green-700">
                    ₦{(wallet?.balance || 0).toLocaleString()}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  Wallet Status: <span className={`font-medium ${wallet?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {wallet?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Wallet Adjustment Form */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjust Wallet Balance</h3>
            <form onSubmit={handleAdjustment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={adjustmentData.transaction_type}
                    onChange={(e) => setAdjustmentData({
                      ...adjustmentData,
                      transaction_type: e.target.value as 'deposit' | 'withdrawal' | 'adjustment'
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="deposit">Deposit (Add Funds)</option>
                    <option value="withdrawal">Withdrawal (Remove Funds)</option>
                    <option value="adjustment">Adjustment (Manual Correction)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={adjustmentData.amount}
                    onChange={(e) => setAdjustmentData({
                      ...adjustmentData,
                      amount: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    disabled={loading}
                  />
                  {errors.amount && (
                    <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description/Reason
                </label>
                <textarea
                  value={adjustmentData.description}
                  onChange={(e) => setAdjustmentData({
                    ...adjustmentData,
                    description: e.target.value
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Provide a reason for this wallet adjustment..."
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAdjustmentData({
                    amount: '',
                    transaction_type: 'deposit',
                    description: '',
                  })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {adjustmentData.transaction_type === 'deposit' ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                      <span>Apply Adjustment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
            {transactionsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getTransactionIcon(transaction.transaction_type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {formatTransactionType(transaction.transaction_type)}
                            </h4>
                            <span className={`text-lg font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
                              {transaction.amount >= 0 ? '+' : ''}₦{transaction.amount.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{transaction.description}</span>
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(transaction.created_at).toLocaleString()}</span>
                            </span>
                            {transaction.processed_by && (
                              <span className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>Processed by admin</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Balance: ₦{transaction.balance_after.toLocaleString()}</p>
                        <p className="text-xs">From: ₦{transaction.balance_before.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2 mt-6">
                    <button
                      onClick={() => fetchTransactions(currentPage - 1)}
                      disabled={currentPage <= 1 || transactionsLoading}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => fetchTransactions(currentPage + 1)}
                      disabled={currentPage >= totalPages || transactionsLoading}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
