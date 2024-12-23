import React from 'react';
import '../../styles/footer/ConditionsPage.css';

const ConditionsPage = () => {
  return (
    <div className="conditions-container">
      <h1>Vilkår og betingelser for Arrangement/Aktiviteter</h1>
      <p className="last-updated">(Oppdatert: 12/12/2024)</p>

      <section className="conditions-section">
        <h2>Innledning</h2>
        <p>
          Disse vilkårene og betingelsene gjelder for både gratis og betalte arrangementer, heretter referert til som
          Aktiviteter, arrangert av Klækken Nettjenester (heretter “Klækken”). Ved å delta eller registrere seg for
          disse aktiviteter godtar medlemmene vilkårene fullt ut. 
        </p>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 1 – Definisjoner</h2>
        <ul>
          <li>
            <strong>“Konto”:</strong> Den personlige portalen som gir medlemmer og abonnenter tilgang til tjenester via
            innlogging på nettsiden.
          </li>
          <li>
            <strong>“Nettside”:</strong> Enhver digital plattform levert av Klækken som gir medlemmer tilgang til
            tjenester og informasjon.
          </li>
          <li>
            <strong>“Arrangement”:</strong> Samlinger, både digitale og fysiske, som organiseres av Klækken for medlemmer
            og abonnenter.
          </li>
          <li>
            <strong>“Medlem”:</strong> En bruker som har registrert seg for å benytte seg av tjenester på KonservativMatch.
          </li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 2 – Registrering for arrangement</h2>
        <h3>2.1 Vilkår for registrering</h3>
        <p>
          Kun personer over 18 år kan registrere seg og utnytte tjenestene levert av KonservativMatch. 
          For å registrere seg, må brukeren logge inn på sin konto og bekrefte opplysningene sine.
        </p>
        <h3>2.2 Registreringsprosess</h3>
        <p>For å registrere seg må man:</p>
        <ol>
          <li>Oppgi korrekt informasjon.</li>
          <li>Godta vilkårene i sin helhet.</li>
          <li>Betale eventuell abonnementsavgift.</li>
        </ol>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 3 – Betaling</h2>
        <p>Betaling kan gjennomføres via:</p>
        <ul>
          <li>Kredittkort eller debetkort.</li>
          <li>Elektroniske betalingsløsninger (Vipps, Stripe).</li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 4 – Ingen angrerett</h2>
        <p>
            Abonnement for tilgang til utvidede funksjoner og tjenester på vår plattform 
            er bindende etter kjøp og ikke underlagt angrerett, i henhold til angrerettloven
        </p>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 5 – Endringer og avlysning</h2>
        <h3>5.1 Endring</h3>
        <p>
          Ved endring av tidspunkt, sted eller dato, informeres medlemmene innen rimelig tid. Medlemmene kan få refusjon
          dersom endringene ikke aksepteres.
        </p>
        <h3>5.2 Avlysning</h3>
        <p>Ved avlysning tilbakebetales beløpet innen 30 dager.</p>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 6 – Atferd og tilgang</h2>
        <p>Medlemmene plikter å:</p>
        <ul>
          <li>Oppføre seg høflig og respektfullt.</li>
          <li>Ikke bryte norsk lov eller retningslinjer satt av Klækken.</li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 7 – Ansvar</h2>
        <ul>
          <li>Klækken kan ikke holdes ansvarlig for skader eller ulemper som oppstår som følge av medlemmenes handlinger under bruk av plattformen eller interaksjon med andre brukere.</li>
          <li>Medlemmer har selv ansvar for å sørge for at de man velger å møte opp med er pålitelige.</li>
        </ul>
      </section>
    </div>
  );
};

export default ConditionsPage;
