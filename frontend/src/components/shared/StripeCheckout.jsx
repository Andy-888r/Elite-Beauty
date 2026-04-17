import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
 
const stripePromise = loadStripe('pk_test_51TL9fAAfPNd9qe3xUd4SyrMqmN4yO4bJd8dg60qO7Ka6qu5EcdQXJzRfhV7ptoLExP5Ishre50feOOiQmaBfRSwq00iaSqXT59');
 
const elementsOptions = {
  appearance: { theme: 'none' },
  loader: 'never',
};
 
const inputStyle = {
  style: {
    base: {
      fontSize: '14px',
      color: '#2C4A1E',
      fontFamily: "'Jost', sans-serif",
      '::placeholder': { color: 'rgba(85,136,59,0.40)' },
    },
    invalid: { color: '#8B2E2E' },
  },
  disableLink: true,
};
 
function CheckoutForm({ monto, descripcion, onSuccess, onError, onRegresar }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setMensaje('');
    try {
      const res = await fetch('http://localhost:8080/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto }),
      });
      if (!res.ok) throw new Error('Error al crear el intento de pago');
      const { clientSecret } = await res.json();
 
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardNumberElement) },
      });
 
      if (error) {
        setMensaje(error.message);
        onError?.(error);
      } else if (paymentIntent.status === 'succeeded') {
        setMensaje('¡Pago exitoso!');
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setMensaje(err.message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
 
      {onRegresar && (
        <button type="button" onClick={onRegresar} style={styles.btnRegresar}
          onMouseEnter={e => { e.currentTarget.style.color = '#2C4A1E'; e.currentTarget.style.background = 'rgba(85,136,59,0.10)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#55883B'; e.currentTarget.style.background = 'transparent'; }}>
          ← Regresar al carrito
        </button>
      )}
 
      <div style={styles.encabezado}>
        <p style={styles.descripcion}>{descripcion}</p>
        <p style={styles.monto}>${(monto / 100).toFixed(2)} <span style={styles.moneda}>MXN</span></p>
      </div>
 
      <div style={styles.cardLogos}>
        <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" style={styles.logo}/>
        <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" style={styles.logo}/>
        <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" style={styles.logo}/>
      </div>
 
      <div style={styles.campo}>
        <label style={styles.label}>Número de tarjeta</label>
        <div style={styles.inputBox}>
          <CardNumberElement options={inputStyle} />
        </div>
      </div>
 
      <div style={styles.fila}>
        <div style={styles.campo}>
          <label style={styles.label}>Vencimiento</label>
          <div style={styles.inputBox}>
            <CardExpiryElement options={inputStyle} />
          </div>
        </div>
        <div style={styles.campo}>
          <label style={styles.label}>CVC</label>
          <div style={styles.inputBox}>
            <CardCvcElement options={inputStyle} />
          </div>
        </div>
      </div>
 
      {mensaje && (
        <p style={mensaje.includes('exitoso') ? styles.exito : styles.error}>
          {mensaje}
        </p>
      )}
 
      <button type="submit" disabled={!stripe || loading} style={styles.boton}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 24px rgba(44,74,30,0.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 3px 14px rgba(44,74,30,0.28)'; }}>
        {loading ? 'Procesando...' : 'Pagar ahora'}
      </button>
 
      <p style={styles.poweredBy}>Pago seguro · Powered by Stripe</p>
    </form>
  );
}
 
const styles = {
  form: {
    maxWidth: '420px', margin: '0 auto', padding: '22px 24px 20px',
    border: '1px solid rgba(85,136,59,0.25)', borderRadius: '6px',
    backgroundColor: '#F0F9E8', fontFamily: "'Jost', sans-serif",
  },
  btnRegresar: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#55883B', fontFamily: "'Jost', sans-serif",
    fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em',
    padding: '4px 8px', borderRadius: '3px', marginBottom: '16px',
    transition: 'color 0.2s, background 0.2s',
  },
  encabezado: {
    borderBottom: '1px solid rgba(85,136,59,0.15)',
    paddingBottom: '12px', marginBottom: '14px',
  },
  descripcion: {
    fontFamily: "'Jost', sans-serif", fontSize: '0.72rem', fontWeight: 500,
    letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55883B', margin: '0 0 6px',
  },
  monto: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.9rem', fontWeight: 600, color: '#2C4A1E', margin: 0, lineHeight: 1,
  },
  moneda: {
    fontFamily: "'Jost', sans-serif", fontSize: '0.85rem',
    fontWeight: 400, color: '#55883B', letterSpacing: '0.08em',
  },
  cardLogos: { display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' },
  logo: { height: '22px', width: 'auto', objectFit: 'contain' },
  campo: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
  fila: { display: 'flex', gap: '12px', marginTop: '10px', alignItems: 'flex-start' },
  label: {
    fontFamily: "'Jost', sans-serif", fontSize: '0.60rem', fontWeight: 500,
    letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(44,74,30,0.60)',
    marginBottom: '6px', whiteSpace: 'nowrap',
  },
  inputBox: {
    padding: '11px 14px', border: '1px solid rgba(85,136,59,0.30)',
    borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.70)',
  },
  boton: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #2C4A1E, #55883B)',
    color: '#C1E899', border: 'none', borderRadius: '3px',
    fontFamily: "'Jost', sans-serif", fontSize: '0.68rem', fontWeight: 600,
    letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer',
    marginTop: '16px', boxShadow: '0 3px 14px rgba(44,74,30,0.28)',
    transition: 'box-shadow 0.2s',
  },
  poweredBy: {
    fontFamily: "'Jost', sans-serif", fontSize: '0.60rem',
    color: 'rgba(85,136,59,0.55)', textAlign: 'center',
    letterSpacing: '0.10em', marginTop: '12px', marginBottom: 0,
  },
  exito: {
    fontFamily: "'Jost', sans-serif", fontSize: '0.75rem', color: '#2C4A1E',
    background: 'rgba(85,136,59,0.12)', border: '1px solid rgba(85,136,59,0.25)',
    borderRadius: '3px', padding: '8px 12px', marginTop: '10px',
  },
  error: {
    fontFamily: "'Jost', sans-serif", fontSize: '0.75rem', color: '#8B2E2E',
    background: 'rgba(139,46,46,0.07)', border: '1px solid rgba(139,46,46,0.18)',
    borderRadius: '3px', padding: '8px 12px', marginTop: '10px',
  },
};
 
export default function StripeCheckout({ monto, descripcion, onSuccess, onError, onRegresar }) {
  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <CheckoutForm
        monto={monto}
        descripcion={descripcion}
        onSuccess={onSuccess}
        onError={onError}
        onRegresar={onRegresar}
      />
    </Elements>
  );
}
 