'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Up to 5 team members',
      '3 active projects',
      'Basic task management',
      'Team collaboration',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 10,
    features: [
      'Up to 20 team members',
      'Unlimited projects',
      'Advanced task management',
      'Time tracking',
      'Custom fields',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 25,
    features: [
      'Unlimited team members',
      'Unlimited projects',
      'Advanced security',
      'Custom integrations',
      'Dedicated support',
      'API access',
      'SSO authentication',
    ],
  },
];

interface Organization {
  id: string;
}

interface User {
  id: string;
  role: string;
}

interface BillingSettingsProps {
  currentUser: User;
  organization: Organization | null;
}

export function BillingSettings({ currentUser, organization }: BillingSettingsProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = currentUser.role === 'ADMIN';

  const handleUpgrade = async (planId: string) => {
    if (!isAdmin) {
      toast.error('Only administrators can change billing plans');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/billing/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error('Failed to upgrade plan');
      }

      toast.success('Plan upgraded successfully');
      router.refresh();
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Failed to upgrade plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Billing & Plans</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and billing information.
        </p>
      </div>

      {!isAdmin && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Only administrators can manage billing settings.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg border ${
              plan.isPopular
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-white'
            } p-6 shadow-sm`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                  Popular
                </span>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {plan.name}
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-gray-500">
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={!isAdmin || isSubmitting || selectedPlan === plan.id}
                  className={`w-full rounded-md px-3.5 py-2 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    selectedPlan === plan.id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'
                  } disabled:opacity-50`}
                >
                  {selectedPlan === plan.id ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
