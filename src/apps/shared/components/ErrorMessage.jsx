import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

const ErrorMessage = ({ title, description, ctaText = 'Volver', ctaLink = '/' }) => (
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center glass-effect p-10 rounded-2xl shadow-2xl max-w-2xl"
  >
    <XCircle className="mx-auto h-24 w-24 text-red-400" />
    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h1>
    <p className="mt-4 text-lg text-red-200">{description}</p>
    <div className="mt-8">
      <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
        <Link to={ctaLink}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          {ctaText}
        </Link>
      </Button>
    </div>
  </Motion.div>
);

export default ErrorMessage;