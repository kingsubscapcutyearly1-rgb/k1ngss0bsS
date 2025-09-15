import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Clock, 
  Shield, 
  Star, 
  CheckCircle, 
  X,
  TrendingUp,
  Users,
  Zap,
  Award,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import WhatsAppButton from '@/components/WhatsAppButton';

const WhyUs: React.FC = () => {
  const { formatPrice } = useCurrency();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Why <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              10,000+ Entrepreneurs
            </span> Choose Us
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
            While others pay full price like amateurs, smart entrepreneurs choose the smarter path. 
            Here's why we're different from everyone else.
          </p>
          <Badge variant="destructive" className="text-lg px-6 py-2 animate-pulse">
            🔥 50% OFF Everything - Limited Time
          </Badge>
        </div>

        {/* Comparison Table */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              King Subscription vs Traditional Software Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-4 text-lg font-semibold">Feature</th>
                    <th className="pb-4 text-lg font-semibold text-center text-green-600">King Subscription</th>
                    <th className="pb-4 text-lg font-semibold text-center text-red-600">Traditional Pricing</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  <tr className="border-b">
                    <td className="py-4 font-medium">ChatGPT Plus</td>
                    <td className="py-4 text-center">
                      <span className="text-green-600 font-bold text-xl">{formatPrice(20)}/month</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-red-600 font-bold text-xl line-through">{formatPrice(40)}/month</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 font-medium">Adobe Creative Cloud</td>
                    <td className="py-4 text-center">
                      <span className="text-green-600 font-bold text-xl">{formatPrice(52.99)}/month</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-red-600 font-bold text-xl line-through">{formatPrice(105.99)}/month</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 font-medium">Canva Pro</td>
                    <td className="py-4 text-center">
                      <span className="text-green-600 font-bold text-xl">{formatPrice(119.99)}/year</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-red-600 font-bold text-xl line-through">{formatPrice(239.99)}/year</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 font-medium">SEMrush Pro</td>
                    <td className="py-4 text-center">
                      <span className="text-green-600 font-bold text-xl">{formatPrice(99.95)}/month</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-red-600 font-bold text-xl line-through">{formatPrice(199.95)}/month</span>
                    </td>
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-950/20">
                    <td className="py-4 font-bold text-lg">Total Annual Savings</td>
                    <td className="py-4 text-center">
                      <span className="text-green-600 font-bold text-2xl">{formatPrice(1200)}+ SAVED</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-red-600 font-bold text-xl">{formatPrice(2400)}+ WASTED</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Key Advantages */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
            <CardHeader>
              <div className="text-4xl mb-4">💰</div>
              <CardTitle className="text-green-600">Massive Cost Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Save 50%+ on every premium tool. Our bulk purchasing power means lower prices for you.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Average savings: {formatPrice(200)}/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  No price increases ever
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  All premium features included
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader>
              <div className="text-4xl mb-4">⚡</div>
              <CardTitle className="text-blue-600">Lightning Fast Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get your tools in under 2 minutes. No complicated signup processes or waiting periods.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  Instant automated delivery
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  Pre-configured accounts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  Setup assistance included
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
            <CardHeader>
              <div className="text-4xl mb-4">🛡️</div>
              <CardTitle className="text-purple-600">100% Security & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Legitimate accounts with full warranty protection and 24/7 WhatsApp support.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  7-day money-back guarantee
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Account replacement warranty
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  24/7 WhatsApp support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* What Makes Us Different */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              What Makes King Subscription Different
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-600">✅ What We Do</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <span>Negotiate bulk deals directly with software providers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <span>Provide legitimate accounts with full premium features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <span>Offer instant delivery and setup assistance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <span>Guarantee account replacements if issues arise</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <span>Provide 24/7 WhatsApp support for all users</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-red-600">❌ What Others Do</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <span>Charge full retail prices with annual increases</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <span>Lock you into long-term contracts</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <span>Provide slow, outsourced customer support</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <span>Hidden fees and surprise charges</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <span>Make cancellation difficult and costly</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">$2.4M+</div>
                <div className="text-sm text-muted-foreground">Total Saved</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Stop Overpaying for Software?
            </h2>
            <p className="text-xl mb-6 opacity-90 max-w-3xl mx-auto">
              Join 10,000+ smart entrepreneurs who refuse to pay full price. 
              Get premium tools at 50% OFF with instant access and lifetime support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/tools">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-6 text-xl font-bold">
                  🚀 Get 50% OFF Now
                </Button>
              </Link>
              <WhatsAppButton 
                message="Hi! I'm interested in saving 50% on premium tools. Can you help me get started?"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              />
            </div>
            <div className="text-sm opacity-80">
              ⚡ Instant access • 💯 7-day guarantee • 🔒 100% secure • 📞 24/7 support
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhyUs;