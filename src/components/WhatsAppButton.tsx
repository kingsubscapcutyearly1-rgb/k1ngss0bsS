import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  text?: string;
  children?: React.ReactNode;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message = "Hi! I'm interested in your premium tools. Can you help me?",
  className = '',
  variant = 'default',
  size = 'default',
  text = 'ORDER VIA WHATSAPP',
  children
}) => {
  const phoneNumber = '923276847960'; // Your WhatsApp number
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`${className} ${variant === 'default' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
    >
      {children ? children : (
        <>
          <MessageCircle className="h-4 w-4 mr-2" />
          {text}
        </>
      )}
    </Button>
  );
};

export default WhatsAppButton;