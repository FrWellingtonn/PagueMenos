import { useState } from 'react';
import { Search, Calendar, ShoppingBag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockSales, mockProducts, Sale, Product } from '../data/mockData';

export function SalesHistory() {
  const [searchCpf, setSearchCpf] = useState('');
  const [customerSales, setCustomerSales] = useState<Sale[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    if (!searchCpf.trim()) return;

    const cleanCpf = searchCpf.replace(/\D/g, '');

    const sales = mockSales.filter(sale => {
      const saleCleanCpf = sale.patientCpf.replace(/\D/g, '');
      return saleCleanCpf === cleanCpf || sale.patientCpf === searchCpf;
    });

    setCustomerSales(sales);
    setIsSearched(true);

    if (sales.length > 0) {
      generateRecommendations(sales);
    } else {
      setRecommendations([]);
    }
  };

  const generateRecommendations = (sales: Sale[]) => {
    const purchasedCategories = new Set<string>();
    sales.forEach(sale => {
      sale.products.forEach(product => {
        purchasedCategories.add(product.category);
      });
    });

    const recommended = mockProducts.filter(product =>
      purchasedCategories.has(product.category) &&
      !sales.some(sale =>
        sale.products.some(p => p.name === product.name)
      )
    );

    setRecommendations(recommended.slice(0, 3));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR');

  const totalSpent = customerSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-gray-900 font-semibold">Histórico de Vendas</h1>
        <p className="text-sm text-gray-600">Consulte o histórico de compras por CPF</p>
      </div>

      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Search className="h-5 w-5" />
            Buscar por CPF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Digite o CPF (ex: 123.456.789-00)"
              value={searchCpf}
              onChange={(e) => setSearchCpf(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="sm:w-auto">
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSearched && (
        <div className="space-y-6">
          {customerSales.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[{
                  title: 'Total de compras',
                  value: customerSales.length,
                  icon: <ShoppingBag className="h-8 w-8 text-blue-600" />,
                  accent: 'bg-blue-50',
                }, {
                  title: 'Valor total gasto',
                  value: formatCurrency(totalSpent),
                  icon: <TrendingUp className="h-8 w-8 text-green-600" />,
                  accent: 'bg-green-50',
                }, {
                  title: 'Última compra',
                  value: formatDate(customerSales[0].date),
                  icon: <Calendar className="h-8 w-8 text-purple-600" />,
                  accent: 'bg-purple-50',
                }].map((card, index) => (
                  <Card
                    key={card.title}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.accent}`}>
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{card.title}</p>
                        <p className="text-xl font-semibold text-gray-900">{card.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle>Histórico de Compras — {customerSales[0].patientName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customerSales.map((sale, index) => (
                    <div
                      key={sale.id}
                      className="rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm transition hover:shadow-md"
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatDate(sale.date)} • {sale.time}
                          </p>
                          <p className="text-sm text-gray-600">Atendido por: {sale.pharmacist}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(sale.totalAmount)}</p>
                          <Badge variant="outline">{sale.paymentMethod}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {sale.products.map((product) => (
                          <div key={product.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>Qtd: {product.quantity}</p>
                              <p className="font-semibold text-gray-900">{formatCurrency(product.total)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {recommendations.length > 0 && (
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Produtos recomendados
                    </CardTitle>
                    <p className="text-sm text-gray-600">Baseado no histórico de compras do cliente</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {recommendations.map((product) => (
                        <div key={product.id} className="rounded-xl border border-gray-100 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>
                          <p className="mt-2 text-xs text-gray-600">{product.description}</p>
                          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                            <span>{product.manufacturer}</span>
                            <span className="font-semibold text-green-600">{formatCurrency(product.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="animate-fade-in-up">
              <CardContent className="p-8 text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Nenhuma compra encontrada</h3>
                <p className="text-sm text-gray-600">Não foram encontradas compras para o CPF informado.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
