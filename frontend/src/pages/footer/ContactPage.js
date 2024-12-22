import React from 'react';
import '../../styles/footer/ConditionsPage.css';

const ContactPage = () => {
  return (
    <div className="conditions-container">
      <h1>Kontakt oss – Klækken Nettjenester</h1>

      <section className="conditions-section">
        <h2>Vi er her for å hjelpe deg!</h2>
        <p>
          Hos Klækken Nettjenester er vi opptatt av at du skal få en best mulig opplevelse. Hvis du har spørsmål, trenger hjelp,
          eller ønsker å gi tilbakemelding, ikke nøl med å ta kontakt med oss. Vi ser frem til å høre fra deg!
        </p>
      </section>

      <section className="conditions-section">
        <h2>Kontaktinformasjon</h2>
        <ul>
          <li><strong>E-post:</strong> <a href="mailto:support@konservativmatch.no">support@konservativmatch.no</a></li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Ofte stilte spørsmål</h2>
        <p>
          Sjekk vår <a href="/faq">FAQ-side</a> for svar på de vanligste spørsmålene. Hvis du ikke finner svar der, kan du
          alltid kontakte oss direkte.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Sosiale medier</h2>
        <p>
          Følg oss på sosiale medier for å holde deg oppdatert om nyheter, arrangementer, og spennende oppdateringer:
        </p>
        <ul>
          <a href="https://www.instagram.com/klaekken">Instagram</a>
        </ul>
      </section>

    </div>
  );
};

export default ContactPage;