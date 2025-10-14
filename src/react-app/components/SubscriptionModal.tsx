import { useState } from "react";
import { X, Crown, Zap, Shield, Check } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionChange: (userId: string, planType: string) => Promise<void>;
  userId: string;
  currentPlan: string;
}

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    icon: Shield,
    color: 'bg-gray-500',
    features: [
      'Essential event booking',
      'Standard venue access',
      'Email support',
      'Basic analytics',
      'Mobile app access'
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '₦35,000',
    icon: Zap,
    color: 'bg-yellow-500',
    features: [
      'Everything in Basic',
      'Premium venue access',
      'Priority support',
      'Advanced analytics',
      'Event promotion tools',
      'Custom notifications'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '₦65,000',
    icon: Crown,
    color: 'bg-purple-500',
    features: [
      'Everything in Gold',
      'VIP event access',
      'Dedicated support',
      'White-label options',
      'Advanced integrations',
      'Custom event creation',
      'Priority booking'
    ]
  }
];

export default function SubscriptionModal({
  isOpen,
  onClose,
  onSubscriptionChange,
  userId,
  currentPlan,
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscriptionChange = async () => {
    if (selectedPlan === currentPlan) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      await onSubscriptionChange(userId, selectedPlan);
      onClose();
    } catch (error) {
      console.error('Failed to update subscription:', error);
      alert('Failed to update subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Manage Subscription</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Current plan: <span className="font-medium capitalize">{currentPlan}</span>
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              const isCurrent = currentPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${plan.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900">
                      {plan.price}
                      {plan.id !== 'basic' && <span className="text-lg text-gray-500">/month</span>}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-purple-500 pointer-events-none">
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubscriptionChange}
              disabled={selectedPlan === currentPlan || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </div>
              ) : selectedPlan === currentPlan ? (
                'No Change'
              ) : (
                `Switch to ${plans.find(p => p.id === selectedPlan)?.name}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
