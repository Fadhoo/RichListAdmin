import { useState } from "react";
import { X, Send, UserPlus, Mail, Users } from "lucide-react";

interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[], role: string, subscriptionPlan: string) => Promise<void>;
}

export default function UserInviteModal({
  isOpen,
  onClose,
  onInvite,
}: UserInviteModalProps) {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState('user');
  const [subscriptionPlan, setSubscriptionPlan] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [inviteType, setInviteType] = useState<'single' | 'bulk'>('single');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailList = emails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));

      if (emailList.length === 0) {
        alert('Please enter at least one valid email address');
        return;
      }

      await onInvite(emailList, role, subscriptionPlan);
      
      // Reset form
      setEmails('');
      setRole('user');
      setSubscriptionPlan('basic');
      onClose();
    } catch (error) {
      console.error('Failed to send invitations:', error);
      alert('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const emailCount = emails
    .split(/[,\n]/)
    .map(email => email.trim())
    .filter(email => email && email.includes('@')).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Invite Users</h2>
                <p className="text-sm text-gray-600">Send invitations to join RichList</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invite Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setInviteType('single')}
              className={`p-4 rounded-xl border-2 transition-all ${
                inviteType === 'single'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Mail className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium text-gray-900">Single Invite</div>
              <div className="text-xs text-gray-600">Invite one user at a time</div>
            </button>
            <button
              type="button"
              onClick={() => setInviteType('bulk')}
              className={`p-4 rounded-xl border-2 transition-all ${
                inviteType === 'bulk'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium text-gray-900">Bulk Invite</div>
              <div className="text-xs text-gray-600">Invite multiple users</div>
            </button>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address{inviteType === 'bulk' ? 'es' : ''}
            </label>
            {inviteType === 'single' ? (
              <input
                type="email"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="user@example.com"
                required
                disabled={loading}
              />
            ) : (
              <div>
                <textarea
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="user1@example.com, user2@example.com&#10;user3@example.com&#10;user4@example.com"
                  required
                  disabled={loading}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Separate emails with commas or line breaks. 
                  {emailCount > 0 && <span className="font-medium"> {emailCount} valid email(s) detected.</span>}
                </p>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="user">Regular User</option>
              <option value="promoter">Event Promoter</option>
              <option value="venue_owner">Venue Owner</option>
              <option value="admin">Administrator</option>
            </select>
            <p className="text-sm text-gray-600 mt-1">
              Determines what permissions the user will have
            </p>
          </div>

          {/* Initial Subscription Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Subscription Plan
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'basic', name: 'Basic', price: 'Free', color: 'bg-gray-100 border-gray-300' },
                { id: 'gold', name: 'Gold', price: '₦35,000/mo', color: 'bg-yellow-100 border-yellow-300' },
                { id: 'platinum', name: 'Platinum', price: '₦65,000/mo', color: 'bg-purple-100 border-purple-300' }
              ].map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSubscriptionPlan(plan.id)}
                  disabled={loading}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    subscriptionPlan === plan.id
                      ? 'border-purple-500 bg-purple-50'
                      : plan.color
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                  <div className="text-xs text-gray-600">{plan.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Invitation Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Invitation Preview</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Recipients will receive an email invitation to join RichList</p>
              <p>• Initial role: <span className="font-medium capitalize">{role.replace('_', ' ')}</span></p>
              <p>• Subscription plan: <span className="font-medium capitalize">{subscriptionPlan}</span></p>
              <p>• They can accept the invitation and set up their account</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || emailCount === 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send {emailCount > 1 ? `${emailCount} ` : ''}Invitation{emailCount > 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
