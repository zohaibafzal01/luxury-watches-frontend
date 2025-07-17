
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown, 
  Clock, 
  Shield, 
  Users, 
  Zap, 
  Award,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Crown,
      title: 'Luxury Service Network',
      description: 'Connect with certified dealers specializing in premium timepieces'
    },
    {
      icon: Clock,
      title: 'Fast Turnaround',
      description: 'Get competitive bids and quick service from verified professionals'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'All dealers are vetted and insured for your peace of mind'
    },
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Access a curated network of watch specialists and collectors'
    }
  ];

  const brands = [
    'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier',
    'Breitling', 'TAG Heuer', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Premium Watch Services
            </Badge>
            
            <h1 className="font-luxury text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              ChronoBid
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              The premier marketplace for luxury watch services. Connect with certified dealers, 
              get competitive bids, and ensure your timepieces receive the care they deserve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isAuthenticated ? (
                <Button asChild className="luxury-button text-lg px-8 py-6">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="luxury-button text-lg px-8 py-6">
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="text-lg px-8 py-6 border-primary/20">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Certified Dealers
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Fully Insured
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                Premium Service
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="luxury-title text-3xl md:text-4xl mb-4">
              Why Choose ChronoBid
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of luxury watch services with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="luxury-card group hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Brands */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto text-center">
          <h2 className="luxury-title text-3xl md:text-4xl mb-4">
            Trusted by Collectors Worldwide
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Our network services all major luxury watch brands
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-colors"
              >
                {brand}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="luxury-title text-3xl md:text-4xl mb-6">
              Ready to Experience Premium Watch Services?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of watch enthusiasts who trust ChronoBid for their timepiece needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="luxury-button text-lg px-8 py-6">
                <Link to="/register">
                  <Crown className="mr-2 w-5 h-5" />
                  Start Your Journey
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-lg px-8 py-6 border-primary/20">
                <Link to="/login">Learn More</Link>
              </Button>
            </div>

            <div className="mt-8 flex justify-center items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-2">Rated 5.0 by 1,200+ customers</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
