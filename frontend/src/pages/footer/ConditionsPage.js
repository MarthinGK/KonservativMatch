import React from 'react';
import '../../styles/footer/ConditionsPage.css';

const ConditionsPage = () => {
  return (
    <div className="conditions-container">
      <h1>Vilkår og betingelser for brukere på KonservativMatch</h1>
      <p className="last-updated">(Oppdatert: 12/12/2024)</p>

      <section className="conditions-section">
        <h2>Innledning</h2>
        <p>
          Disse vilkårene og betingelsene regulerer bruken av tjenestene levert av Klækken Nettjenester, 
          inkludert KonservativMatch, og gjelder både for gratis og betalte tjenester. 
          Ved å registrere deg og bruke våre tjenester, godtar du å være bundet av disse vilkårene.
        </p>
        <p>
          Formålet med vilkårene er å tydeliggjøre rettigheter og plikter for begge parter, 
          samt å sikre en trygg og ryddig opplevelse for våre brukere. 
          Vi oppfordrer deg til å lese gjennom vilkårene nøye før du tar i bruk våre tjenester.
        </p>
        <p>
          Ved å bruke våre tjenester bekrefter du at du har lest, forstått og akseptert disse vilkårene i sin helhet.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 1 – Definisjoner</h2>
        <ul>
          <li>
            <strong>“Medlem”:</strong> En bruker som har registrert seg for å benytte seg av tjenester på KonservativMatch.
          </li>
          <li>
            <strong>“Konto”:</strong> Den personlige portalen som gir medlemmer og abonnenter tilgang til tjenester via
            innlogging på KonservativMatch.
          </li>
          <li>
            <strong>“Abonnement”:</strong> Den betalende løsningen "KonservativMatch Premium" som gir brukere utvidede funksjoner og tjenester på KonservativMatch. 
          </li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 2 – Registrering</h2>
        <h3>2.1 Vilkår for registrering</h3>
        <p>
          Kun personer over 18 år kan registrere seg og utnytte tjenestene levert av KonservativMatch. 
          Registrering skjer via leverandøren Auth0, hvor brukeren kan opprette en konto manuelt eller registrere seg ved hjelp av tredjepartstjenester som Gmail eller lignende.
        </p>
        <h3>2.2 Registreringsprosess</h3>
        <p>For å registrere seg må man:</p>
        <ol>
          <li>Oppgi korrekt informasjon.</li>
          <li>Godta vilkårene i sin helhet.</li>
        </ol>
      </section>


      <section className="conditions-section">
        <h2>Artikkel 3 – Abonnement</h2>
        <p>
          Abonnement på KonservativMatch heter "KonservativMatch Premium" og kommer i form av et månedlig abonnenement
          som gir tilgang til utvidede funksjoner og tjenester. Les mer om hvilke funksjoner KonservativMatch Premium gir her. 
        </p> 
        
        <h3>3.1 Betaling og pris</h3>
        <p>Pris på KonservativMatch Premium er 129 kr per måned</p>
        <p>
          Alle priser oppgis i norske kroner (NOK) og inkluderer alle gjeldende avgifter. 
          Klækken forbeholder seg retten til å justere prisene for abonnementet. 
          Eventuelle prisendringer vil bli kommunisert minst 30 dager i forveien.
        </p>
        <p>Betaling for KonservativMatch Premium kan gjennomføres via:</p>
        <ul>
          <li>Kredittkort eller debetkort.</li>
          <li>Elektroniske betalingsløsninger (Vipps, Stripe).</li>
        </ul>
        <p>KonservativMatch Premium trer i kraft i det tidspunktet betalingen er utført og registrert på vår side.</p>
        

        <h3>3.2 Fornyelse</h3>
        <p>Under oppsettet av KonservativMatch Premium vil brukeren få mulighet til å velge om abonnementet skal foryes automatisk eller ikke.</p>

        <h3>3.3 Angrerett</h3>
        <p>KonservativMatch Premium er bindende etter kjøp og ikke underlagt angrerett.</p>
        <p>
          Når du kjøper KonservativMatch Premium, samtykker du til at angreretten 
          ikke gjelder, i henhold til angrerettloven § 22. 
        </p>
        <p>
          Ved større uforutsette tekniske problemer på vår side som hindrer deg i å bruke 
          premium-funksjonene i over 12 timer sammenhengende, så vil det dobbelte av den tapte tiden bli lagt til på abonnementets varighet.
          Dersom KonservativMatch er utilgjengelig i 24 timer, så vil eksisterende abonnementer få en utvidet varighet på 48 timer. 
        </p>

        <h3>3.4 Avlysning av abonnement</h3>
        <p>Brukere kan når som helst avbryte KonservativMatch Premium. Abonnementet vil dermed ikke fornyes.</p>
        <p>
          Månedlige abonnementer gjelder for hele abonnementsperioden på 30 dager, 
          uavhengig av når abonnementet avsluttes i perioden. 
          Dette betyr at det ikke gis refusjon for gjenværende dager dersom abonnementet avsluttes før perioden er utløpt.
          Dette betyr at abonnementet må avlyses før slutten av abonnementsperioden for å unngå belastning for den neste perioden. 
          Etter at abonnementet er fornyet, gis det ikke refusjon for den påbegynte perioden.
        </p>
        <p>Etter avlyst abonnement vil de utvidede funksjonene og tjenestene som er forbundet med KonservativMatch Premium virke som normalt til abonnementsperioden er utløpt.</p>

        <h3>3.5 Endringer</h3>
        <p>Ved endringer av KonservativMatch Premium som endrer betingelsene på abonnementet så plikter KonservativMatch å informere abonnentene om dette minst 30 dager før endringene trer i kraft. </p>
      </section>


      <section className="conditions-section">
        <h2>Artikkel 4 – Atferd og tilgang</h2>
        <p>Medlemmene plikter å:</p>
        <ul>
          <li>Oppføre seg høflig og respektfullt.</li>
          <li>Ikke bryte norsk lov eller retningslinjer satt av Klækken.</li>
          <li>Brudd på norsk lov eller plattformens retningslinjer kan føre til midlertidig eller permanent utestengelse fra plattformen uten refusjon for eventuell gjenværende abonnementsperiode.</li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Artikkel 5 – Ansvar</h2>
        <ul>
          <li>Klækken kan ikke holdes ansvarlig for skader eller ulemper som oppstår som følge av medlemmenes handlinger under bruk av plattformen eller interaksjon med andre brukere.</li>
          <li>Medlemmer har selv ansvar for å sørge for at de man velger å møte opp med er pålitelige.</li>
          <li>Klækken Nettjenester kan ikke holdes ansvarlig for midlertidig utilgjengelighet av plattformen, tap av data eller annen skade som oppstår som følge av tekniske problemer utenfor selskapets kontroll.</li>
        </ul>
      </section>
    </div>
  );
};

export default ConditionsPage;
