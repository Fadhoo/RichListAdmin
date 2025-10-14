import { useState, useEffect } from "react";
import { X, CreditCard, DollarSign, TrendingUp, Activity } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface SubscriptionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

interface SubscriptionRecord {
  id: number;
  plan_type: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  billing_cycle: string;
  price_paid: number;
  payment_method: string;
  created_at: string;
}

interface PaymentRecord {
  id: number;
  amount: number;
  currency: string;
  status: string;
  payment_date: string;
  payment_method: string;
  subscription_id: number;
}

export default function SubscriptionHistoryModal({
  isOpen,
  onClose,
  userId,
  userName,
}: SubscriptionHistoryModalProps) {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'payments'>('subscriptions');

  useEffect(() => {
    if (isOpen && userId) {
      fetchSubscriptionHistory();
    }
  }, [isOpen, userId]);

  const fetchSubscriptionHistory = async () => {
    setLoading(true);
    try {
      const [subsResponse, paymentsResponse] = await Promise.all([
        fetch(`/api/admin/users/${userId}/subscriptions`, {
          credentials: 'include',
        }),
        fetch(`/api/admin/users/${userId}/payments`, {
          credentials: 'include',
        })
      ]);

      if (subsResponse.ok) {
        const subsData = await subsResponse.json();
        setSubscriptions(subsData.subscriptions || []);
      }

      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch subscription history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeSubscription = subscriptions.find(s => s.status === 'active');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Subscription History</h2>
                <p className="text-sm text-gray-600">{userName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Plan</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {activeSubscription?.plan_type || 'No Active Plan'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₦{totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Subscriptions</p>
                    <p className="text-lg font-semibold text-gray-900">{subscriptions.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'subscriptions'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Subscriptions ({subscriptions.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'payments'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Payments ({payments.length})
              </button>
            </div>

            {/* Content */}
            {activeTab === 'subscriptions' ? (
              <div className="space-y-4">
                {subscriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No subscription history found</p>
                  </div>
                ) : (
                  subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            subscription.plan_type === 'platinum' ? 'bg-purple-100' :
                            subscription.plan_type === 'gold' ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            <CreditCard className={`w-6 h-6 ${
                              subscription.plan_type === 'platinum' ? 'text-purple-600' :
                              subscription.plan_type === 'gold' ? 'text-yellow-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 capitalize">
                              {subscription.plan_type} Plan
                            </h3>
                            <p className="text-sm text-gray-600">
                              {subscription.billing_cycle} billing • ₦{subscription.price_paid.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {subscription.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(subscription.started_at).toLocaleDateString()} - {
                              subscription.expires_at 
                                ? new Date(subscription.expires_at).toLocaleDateString()
                                : 'Ongoing'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No payment history found</p>
                  </div>
                ) : (
                  payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            payment.status === 'completed' ? 'bg-green-100' :
                            payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                          }`}>
                            <DollarSign className={`w-6 h-6 ${
                              payment.status === 'completed' ? 'text-green-600' :
                              payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              ₦{payment.amount.toLocaleString()} {payment.currency}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {payment.payment_method} • {new Date(payment.payment_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
