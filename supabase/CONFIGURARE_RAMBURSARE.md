# 📖 Procedură Manuală de Rambursare (Stripe Dashboard)

Acest document descrie pașii simpli pe care fondatoarea îi parcurge în dashboard-ul Stripe atunci când primește o solicitare de rambursare pe e-mail (`academipython@gmail.com`).

---

## 📋 Pașii de Procesare a Rambursării

1. **Autentificare Stripe:**
   - Intră în dashboard-ul [dashboard.stripe.com](https://dashboard.stripe.com).

2. **Căutarea Plății / Clientului:**
   - În bara de căutare de sus, introdu adresa de e-mail a utilizatorului care a solicitat rambursarea.
   - Apasă pe plata respectivă (Payment Intent sau Charge) asociată abonamentului.

3. **Efectuarea Rambursării (Refund):**
   - Apasă pe butonul **Refund** (top-right pe pagina plății).
   - Selectează suma integrală (*Full refund*).
   - La motiv, poți alege *Requested by customer*.
   - Confirmă apăsând **Refund**.

4. **Actualizare Stare Cont în Supabase:**
   - Dacă utilizatorul și-a anulat deja abonamentul din `/cont`, statutul se va actualiza automat via Webhook (`customer.subscription.deleted`).
   - În tabelul `public.users_meta`, poți seta direct coloana `subscription_status = 'canceled'` pentru utilizatorul respectiv.

---

### ⏱️ Durată procesare:
- Fondurile sunt eliberate de Stripe instantaneu.
- Banii reapar pe cardul clientului în 2 – 10 zile lucrătoare (în funcție de banca emitentă a cardului).
