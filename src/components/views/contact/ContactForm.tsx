'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = locale === 'es' ? 'El nombre es requerido' : 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = locale === 'es' ? 'El correo electrónico es requerido' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === 'es' ? 'Formato de correo electrónico inválido' : 'Invalid email format';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = locale === 'es' ? 'El asunto es requerido' : 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = locale === 'es' ? 'El mensaje es requerido' : 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = locale === 'es' ? 'El mensaje debe tener al menos 10 caracteres' : 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Mock API call - replace with actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/error randomly for demo
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {locale === 'es' ? 'Envíanos un Mensaje' : 'Send us a Message'}
        </h2>
        <p className="text-gray-600">
          {locale === 'es' 
            ? 'Completa el formulario y nos pondremos en contacto contigo pronto.'
            : 'Fill out the form and we\'ll get back to you soon.'
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {locale === 'es' ? 'Nombre Completo' : 'Full Name'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={locale === 'es' ? 'Tu nombre completo' : 'Your full name'}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {locale === 'es' ? 'Correo Electrónico' : 'Email Address'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={locale === 'es' ? 'tu@email.com' : 'your@email.com'}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              {locale === 'es' ? 'Asunto' : 'Subject'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder={locale === 'es' ? '¿En qué podemos ayudarte?' : 'How can we help you?'}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              {locale === 'es' ? 'Mensaje' : 'Message'} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={locale === 'es' ? 'Cuéntanos más sobre tu consulta...' : 'Tell us more about your inquiry...'}
              className={`min-h-32 resize-none ${errors.message ? 'border-red-500' : ''}`}
              rows={5}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckIcon className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {locale === 'es' 
                  ? '¡Mensaje enviado exitosamente! Te responderemos pronto.'
                  : 'Message sent successfully! We\'ll get back to you soon.'
                }
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {locale === 'es' 
                  ? 'Error al enviar el mensaje. Por favor intenta nuevamente.'
                  : 'Error sending message. Please try again.'
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {locale === 'es' ? 'Enviando...' : 'Sending...'}
                </span>
              </div>
            ) : (
              locale === 'es' ? 'Enviar Mensaje' : 'Send Message'
            )}
          </Button>

          {/* Privacy Notice */}
          <p className="text-xs text-muted-foreground text-center">
            {locale === 'es' 
              ? 'Al enviar este formulario, aceptas nuestra política de privacidad y el manejo responsable de tus datos.'
              : 'By submitting this form, you agree to our privacy policy and responsible handling of your data.'
            }
          </p>
        </form>
    </div>
  );
}