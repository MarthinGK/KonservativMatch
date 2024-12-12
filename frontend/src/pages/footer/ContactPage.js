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
          <li><strong>E-post:</strong> <a href="mailto:support@klaekken.no">support@klaekken.no</a></li>
          <li><strong>Telefon:</strong> +47 123 45 678 (mandag til fredag, 09:00–16:00)</li>
          <li><strong>Adresse:</strong> Klækken Nettjenester, 0123 Oslo, Norge</li>
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
        <h2>Tilbakemelding</h2>
        <p>
          Vi verdsetter din mening! Hvis du har forslag til forbedringer eller ønsker å dele din erfaring med oss, kan du sende
          en e-post til <a href="mailto:feedback@klaekken.no">feedback@klaekken.no</a>. Din tilbakemelding hjelper oss å gjøre
          tjenesten enda bedre.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Sosiale medier</h2>
        <p>
          Følg oss på sosiale medier for å holde deg oppdatert om nyheter, arrangementer, og spennende oppdateringer:
        </p>
        <ul>
          <li><a href="https://www.facebook.com/klaekken">Facebook</a></li>
          <li><a href="https://www.instagram.com/klaekken">Instagram</a></li>
          <li><a href="https://www.twitter.com/klaekken">Twitter</a></li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Teknisk support</h2>
        <p>
          Opplever du tekniske problemer? Beskriv problemet ditt i detalj og kontakt oss via e-post på
          <a href="mailto:support@klaekken.no">support@klaekken.no</a>. Vi vil gjøre vårt beste for å hjelpe deg så raskt som mulig.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Personlig hjelp</h2>
        <p>
          Hvis du ønsker personlig assistanse, kan du kontakte oss på telefon eller sende oss en melding via kontaktskjemaet
          på nettsiden. Vi er her for deg!
        </p>
      </section>
    </div>
  );
};

export default ContactPage;