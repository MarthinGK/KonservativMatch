import React from 'react';
import '../../styles/footer/ConditionsPage.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="conditions-container">
      <h1>Personvern – Klækken Nettjenester</h1>

      <section className="conditions-section">
        <h2>Vårt engasjement for ditt personvern</h2>
        <p>
          Hos Klækken Nettjenester tar vi ditt personvern på alvor. Vi er forpliktet til å beskytte dine personlige
          opplysninger i samsvar med GDPR og gi deg full kontroll over hvordan de brukes. Vår personvernerklæring beskriver hvordan vi samler
          inn, bruker og sikrer informasjonen din, i tråd med gjeldende lover og forskrifter.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Informasjon vi samler inn</h2>
        <p>
          Vi samler inn personopplysninger som navn, e-postadresse, og annen informasjon du oppgir når du registrerer
          deg, oppdaterer profilen din, eller kommuniserer med andre medlemmer. Teknisk data, som IP-adresser og
          nettleserinformasjon, kan også bli samlet inn for å forbedre tjenesten.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Hvordan vi bruker informasjonen</h2>
        <ul>
          <li>
            Til å levere og forbedre tjenestene våre, inkludert matchingsalgoritmer og brukeropplevelse.
          </li>
          <li>
            For å sikre sikkerheten til våre brukere gjennom profilkontroller og overvåking av aktivitet.
          </li>
          <li>
            Til kommunikasjon, som varsler om nye meldinger, oppdateringer, og tilbud.
          </li>
          <li>
            For å overholde juridiske krav og beskytte mot svindel eller misbruk.
          </li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Ditt samtykke og dine rettigheter</h2>
        <p>
          Ved å bruke vår tjeneste, gir du ditt samtykke til at vi kan behandle dine personopplysninger som beskrevet
          her. Du har rett til å be om innsyn, retting, eller sletting av dine data. Du kan også trekke tilbake ditt
          samtykke når som helst ved å kontakte oss.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Informasjonskapsler (Cookies)</h2>
        <p>
          Vi bruker informasjonskapsler for å forbedre brukeropplevelsen din. Disse hjelper oss med å analysere trafikk,
          tilpasse innhold, og lagre preferanser. Du kan administrere eller deaktivere informasjonskapsler via
          nettleserinnstillingene dine.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Sikkerhet</h2>
        <p>
          Vi bruker avanserte sikkerhetstiltak for å beskytte informasjonen din mot uautorisert tilgang, tap eller
          misbruk. Dette inkluderer kryptering, brannmurer og kontinuerlige sikkerhetsoppdateringer.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Oppdateringer av denne erklæringen</h2>
        <p>
          Denne personvernerklæringen kan bli oppdatert fra tid til annen for å reflektere endringer i lovgivning eller
          våre praksiser. Vi anbefaler at du regelmessig sjekker denne siden for oppdatert informasjon.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;