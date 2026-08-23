import fs from 'fs';
import path from 'path';
import Stripe from 'stripe';

console.log('=== Verificare Conectare Stripe ===');

// Funcție simplă de încărcare .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('Se citește fișierul .env.local...');
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEq = trimmed.indexOf('=');
    if (firstEq === -1) return;
    const key = trimmed.substring(0, firstEq).trim();
    const val = trimmed.substring(firstEq + 1).trim().replace(/^["']|["']$/g, ''); // Elimină ghilimelele
    process.env[key] = val;
  });
} else {
  console.log('⚠️ Nu s-a găsit fișierul .env.local. Se vor folosi variabilele din environment-ul curent.');
}

const key = process.env.STRIPE_SECRET_KEY;
const priceLunar = process.env.STRIPE_PRICE_ID_LUNAR;
const priceAnual = process.env.STRIPE_PRICE_ID_ANUAL;

if (!key) {
  console.error('❌ EROARE: Lipsește STRIPE_SECRET_KEY din environment sau din .env.local.');
  process.exit(1);
}

console.log(`Cheia Stripe detectată: ${key.substring(0, 7)}...`);
console.log(`Price ID Lunar: ${priceLunar || 'Nespecificat'}`);
console.log(`Price ID Anual: ${priceAnual || 'Nespecificat'}`);

const stripe = new Stripe(key);

async function testStripe() {
  try {
    // 1. Verificare cheie API prin apelarea unui endpoint simplu
    console.log('Se testează conexiunea la API-ul Stripe...');
    const cont = await stripe.paymentIntents.list({ limit: 1 });
    console.log('✅ Conexiune la API-ul Stripe realizată cu succes!');

    // 2. Verificare plan Lunar
    if (priceLunar) {
      try {
        const pretLunarObj = await stripe.prices.retrieve(priceLunar);
        if (pretLunarObj.active) {
          console.log(`✅ Plan Lunar (${priceLunar}) valid și activ!`);
        } else {
          console.log(`⚠️ Plan Lunar (${priceLunar}) există în Stripe, dar este inactiv.`);
        }
      } catch (err) {
        console.error(`❌ Plan Lunar (${priceLunar}) nu a putut fi preluat din Stripe:`, err.message);
      }
    } else {
      console.log('⚠️ Planul lunar nu este definit.');
    }

    // 3. Verificare plan Anual
    if (priceAnual) {
      try {
        const pretAnualObj = await stripe.prices.retrieve(priceAnual);
        if (pretAnualObj.active) {
          console.log(`✅ Plan Anual (${priceAnual}) valid și activ!`);
        } else {
          console.log(`⚠️ Plan Anual (${priceAnual}) există în Stripe, dar este inactiv.`);
        }
      } catch (err) {
        console.error(`❌ Plan Anual (${priceAnual}) nu a putut fi preluat din Stripe:`, err.message);
      }
    } else {
      console.log('⚠️ Planul anual nu este definit.');
    }

    console.log('\n=== Verificare finalizată cu succes! ===');
  } catch (err) {
    console.error('❌ EROARE conexiune Stripe:', err.message);
    process.exit(1);
  }
}

testStripe();
