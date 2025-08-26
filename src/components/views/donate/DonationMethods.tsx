'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ExternalLinkIcon, 
  CopyIcon, 
  CheckIcon,
  CreditCardIcon,
  BanknotesIcon,
  GlobeIcon
} from '@radix-ui/react-icons';

export default function DonationMethods() {
  const params = useParams();
  const locale = params.locale as string;
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const bankAccounts = [
    {
      bank: 'Banco Nacional de Bolivia',
      accountNumber: '1234567890',
      accountHolder: 'Plataforma Boliviana de Desarrollo Social',
      currency: 'BOB',
      swift: 'BNBBOL2L',
      type: locale === 'es' ? 'Cuenta Corriente' : 'Current Account'
    },
    {
      bank: 'Banco Mercantil Santa Cruz',
      accountNumber: '0987654321',
      accountHolder: 'Plataforma Boliviana de Desarrollo Social',
      currency: 'USD',
      swift: 'BMSABOL2',
      type: locale === 'es' ? 'Cuenta en Dólares' : 'Dollar Account'
    },
    {
      bank: 'Banco de Crédito de Bolivia',
      accountNumber: '5678901234',
      accountHolder: 'Plataforma Boliviana de Desarrollo Social',
      currency: 'EUR',
      swift: 'CREDITBOL',
      type: locale === 'es' ? 'Cuenta en Euros' : 'Euro Account'
    }
  ];

  const internationalPlatforms = [
    {
      name: 'PayPal',
      logo: '💳',
      url: 'https://paypal.me/plataformaboliviana',
      description: locale === 'es' 
        ? 'Donaciones seguras con tarjeta de crédito o débito'
        : 'Secure donations with credit or debit card',
      fees: locale === 'es' ? 'Comisión: 3.4% + $0.30 USD' : 'Fee: 3.4% + $0.30 USD',
      currencies: ['USD', 'EUR', 'GBP']
    },
    {
      name: 'Wise (TransferWise)',
      logo: '🌐',
      url: 'https://wise.com/pay/me/plataformaboliviana',
      description: locale === 'es' 
        ? 'Transferencias internacionales con mejor tipo de cambio'
        : 'International transfers with better exchange rates',
      fees: locale === 'es' ? 'Comisión: 0.5-2%' : 'Fee: 0.5-2%',
      currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    {
      name: 'Western Union',
      logo: '💰',
      url: 'https://westernunion.com',
      description: locale === 'es' 
        ? 'Envíos de dinero disponibles en oficinas físicas'
        : 'Money transfers available at physical offices',
      fees: locale === 'es' ? 'Comisión variable' : 'Variable fee',
      currencies: ['USD', 'EUR', 'BOB']
    }
  ];

  const cryptoWallets = [
    {
      currency: 'Bitcoin (BTC)',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      qrCode: '₿'
    },
    {
      currency: 'Ethereum (ETH)',
      address: '0x742d35Cc6639C0532fFE252c38e84DDAC16C',
      qrCode: 'Ξ'
    },
    {
      currency: 'USDT (Tether)',
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      qrCode: '₮'
    }
  ];

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(type);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div id="donation-methods" className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {locale === 'es' ? 'Formas de Donar' : 'Ways to Donate'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {locale === 'es' 
            ? 'Elige el método que más te convenga. Todas las donaciones son seguras y van directamente a nuestros proyectos.'
            : 'Choose the method that works best for you. All donations are secure and go directly to our projects.'
          }
        </p>
      </div>

      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <BanknotesIcon className="h-4 w-4" />
            {locale === 'es' ? 'Transferencia Bancaria' : 'Bank Transfer'}
          </TabsTrigger>
          <TabsTrigger value="online" className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            {locale === 'es' ? 'Plataformas Online' : 'Online Platforms'}
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center gap-2">
            <GlobeIcon className="h-4 w-4" />
            {locale === 'es' ? 'Criptomonedas' : 'Cryptocurrency'}
          </TabsTrigger>
        </TabsList>

        {/* Bank Transfer Tab */}
        <TabsContent value="bank" className="space-y-6">
          <Alert>
            <BanknotesIcon className="h-4 w-4" />
            <AlertDescription>
              {locale === 'es' 
                ? 'Las transferencias bancarias son gratuitas y seguras. Por favor incluye "Donación Plataforma Boliviana" en el concepto.'
                : 'Bank transfers are free and secure. Please include "Plataforma Boliviana Donation" in the reference.'
              }
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankAccounts.map((account, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    {account.bank}
                    <Badge variant="outline">{account.currency}</Badge>
                  </CardTitle>
                  <CardDescription>{account.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {locale === 'es' ? 'Número de Cuenta:' : 'Account Number:'}
                      </label>
                      <div className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="font-mono">{account.accountNumber}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(account.accountNumber, `account-${index}`)}
                        >
                          {copiedAccount === `account-${index}` ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {locale === 'es' ? 'Titular:' : 'Account Holder:'}
                      </label>
                      <p className="text-sm break-words">{account.accountHolder}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {locale === 'es' ? 'Código SWIFT:' : 'SWIFT Code:'}
                      </label>
                      <div className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="font-mono">{account.swift}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(account.swift, `swift-${index}`)}
                        >
                          {copiedAccount === `swift-${index}` ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Online Platforms Tab */}
        <TabsContent value="online" className="space-y-6">
          <Alert>
            <CreditCardIcon className="h-4 w-4" />
            <AlertDescription>
              {locale === 'es' 
                ? 'Las plataformas online cobran una pequeña comisión, pero ofrecen conveniencia y seguridad adicional.'
                : 'Online platforms charge a small fee, but offer convenience and additional security.'
              }
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalPlatforms.map((platform, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-3">
                    <span className="text-2xl">{platform.logo}</span>
                    {platform.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {platform.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        {locale === 'es' ? 'Monedas Aceptadas:' : 'Accepted Currencies:'}
                      </label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {platform.currencies.map(currency => (
                          <Badge key={currency} variant="secondary" className="text-xs">
                            {currency}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        {locale === 'es' ? 'Comisiones:' : 'Fees:'}
                      </label>
                      <p className="text-xs text-muted-foreground">{platform.fees}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => window.open(platform.url, '_blank')}
                  >
                    <ExternalLinkIcon className="h-4 w-4 mr-2" />
                    {locale === 'es' ? 'Donar via' : 'Donate via'} {platform.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cryptocurrency Tab */}
        <TabsContent value="crypto" className="space-y-6">
          <Alert>
            <GlobeIcon className="h-4 w-4" />
            <AlertDescription>
              {locale === 'es' 
                ? 'Las donaciones en criptomonedas son anónimas y no tienen comisiones bancarias. Por favor verifica la dirección antes de enviar.'
                : 'Cryptocurrency donations are anonymous and have no banking fees. Please verify the address before sending.'
              }
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cryptoWallets.map((wallet, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-3">
                    <span className="text-2xl">{wallet.qrCode}</span>
                    {wallet.currency}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {locale === 'es' ? 'Dirección de Wallet:' : 'Wallet Address:'}
                    </label>
                    <div className="flex items-center justify-between bg-muted p-2 rounded mt-1">
                      <span className="font-mono text-xs break-all">{wallet.address}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(wallet.address, `crypto-${index}`)}
                      >
                        {copiedAccount === `crypto-${index}` ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-4xl mb-2">{wallet.qrCode}</div>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'es' ? 'Código QR disponible' : 'QR Code available'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">
              ⚠️ {locale === 'es' ? 'Importante sobre Criptomonedas' : 'Important about Cryptocurrency'}
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • {locale === 'es' 
                  ? 'Las transacciones en blockchain son irreversibles'
                  : 'Blockchain transactions are irreversible'
                }
              </li>
              <li>
                • {locale === 'es' 
                  ? 'Verifica siempre la dirección antes de enviar'
                  : 'Always verify the address before sending'
                }
              </li>
              <li>
                • {locale === 'es' 
                  ? 'Los valores pueden fluctuar hasta la confirmación'
                  : 'Values may fluctuate until confirmation'
                }
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}