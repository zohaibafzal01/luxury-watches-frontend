
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryItem } from '@/types/inventory';
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye, MessageSquare, Filter } from 'lucide-react';

export const WholesalerDashboard: React.FC = () => {
  const [availableInventory, setAvailableInventory] = useState<InventoryItem[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for wholesaler inventory browsing
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        dealerId: 'dealer1',
        sku: 'RLX-SUB-001',
        brand: 'Rolex',
        model: 'Submariner',
        reference: '116610LN',
        year: 2020,
        condition: 'excellent',
        price: 8500,
        cost: 7500,
        quantity: 1,
        status: 'available',
        description: 'Black dial, ceramic bezel, excellent condition with box and papers',
        images: ['/api/placeholder/300/300'],
        specifications: {
          movement: 'Automatic',
          caseMaterial: 'Stainless Steel',
          caseSize: '40mm',
          dialColor: 'Black',
          strapMaterial: 'Stainless Steel',
          waterResistance: '300m',
          features: ['Date', 'Unidirectional Bezel']
        },
        stock: 1,
        tags: ['luxury', 'dive watch', 'rolex'],
        photos: ['/api/placeholder/300/300'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        dealerId: 'dealer2',
        sku: 'OMG-SPD-001',
        brand: 'Omega',
        model: 'Speedmaster',
        reference: '310.30.42.50.01.001',
        year: 2019,
        condition: 'very-good',
        price: 3200,
        cost: 2800,
        quantity: 3,
        status: 'available',
        description: 'Moonwatch Professional, manual wind',
        images: ['/api/placeholder/300/300'],
        specifications: {
          movement: 'Manual',
          caseMaterial: 'Stainless Steel',
          caseSize: '42mm',
          dialColor: 'Black',
          strapMaterial: 'Leather',
          waterResistance: '50m',
          features: ['Chronograph', 'Tachymeter']
        },
        stock: 3,
        tags: ['omega', 'chronograph', 'moonwatch'],
        photos: ['/api/placeholder/300/300'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const mockOrders = [
      {
        id: 'WO-001',
        dealerId: 'dealer1',
        dealerName: 'Luxury Timepieces Inc.',
        items: [{ brand: 'Rolex', model: 'Submariner', quantity: 2, price: 8500 }],
        totalAmount: 17000,
        status: 'pending',
        orderDate: new Date().toISOString(),
      },
      {
        id: 'WO-002',
        dealerId: 'dealer2',
        dealerName: 'Premium Watches LLC',
        items: [{ brand: 'Omega', model: 'Speedmaster', quantity: 5, price: 3200 }],
        totalAmount: 16000,
        status: 'confirmed',
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    setTimeout(() => {
      setAvailableInventory(mockInventory);
      setMyOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-500/20 text-green-700',
      reserved: 'bg-yellow-500/20 text-yellow-700',
      sold: 'bg-gray-500/20 text-gray-700',
      pending: 'bg-blue-500/20 text-blue-700',
      confirmed: 'bg-green-500/20 text-green-700',
      shipped: 'bg-purple-500/20 text-purple-700',
      delivered: 'bg-gray-500/20 text-gray-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-shimmer p-8 rounded-lg">
          <p className="text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">Wholesaler Dashboard</h1>
          <p className="text-muted-foreground">
            Browse dealer inventory and manage wholesale orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Items</p>
                  <p className="text-2xl font-bold text-primary">{availableInventory.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold text-blue-500">{myOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Order Value</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${myOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                  <p className="text-2xl font-bold text-purple-500">+24%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="inventory">Browse Inventory</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Available Inventory</h2>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
            <div className="grid gap-4">
              {availableInventory.map((item) => (
                <Card key={item.id} className="luxury-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {item.brand} {item.model}
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Reference: {item.reference} • Year: {item.year} • Stock: {item.stock}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-lg font-bold text-green-600">
                          ${item.price.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {item.condition}
                        </Badge>
                      </div>
                      <Button className="luxury-button">
                        Add to Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid gap-4">
              {myOrders.map((order) => (
                <Card key={order.id} className="luxury-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Order {order.id}
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {order.dealerName} • {new Date(order.orderDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.brand} {item.model} (×{item.quantity})</span>
                          <span>${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold">
                        Total: ${order.totalAmount.toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Dealer
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
