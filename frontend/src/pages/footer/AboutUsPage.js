import React from 'react';
import '../../styles/footer/ConditionsPage.css';

const AboutUsPage = () => {
  return (
    <div className="conditions-container">
      <h1>Om oss – Klækken Nettjenester</h1>

      <section className="conditions-section">
        <h2>KonservativMatch – Forbindelser starter her!</h2>
        <p>
          I et samfunn preget av hookup-kulturer og useriøse forhold så kan det være vanskelig for de med konservative holdninger å finne det man leter etter.
          KonservativMatch ble derfor laget for å gjøre det mer trivielt for de med konservative verdier å finne nye likesinnede mennesker. 
          Her kan du bygge meningsfulle forbindelser med mennesker som deler de samme prinsippene og ambisjonene som deg selv.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Om selskapet</h2>
        <p>
          Klækken Nettjenester ble grunnlagt med målet om å tilby en trygg og pålitelig plattform for
          nettdating. Vårt team er dedikert til å skape en opplevelse som kombinerer innovasjon med personlig
          tilpasning. Vi opererer fra Norge og fokuserer på å tilby tjenester som gjenspeiler våre brukeres behov,
          verdier og forventninger. Med en sterk forankring i et trygt miljø, har vi utviklet en
          tjeneste som gir ekte muligheter til å finne forbindelser.
        </p>
      </section>

      <section className="conditions-section">
        <h2>Hva vi tilbyr</h2>
        <ul>
          <li><strong>Matchingsystem:</strong> Vår algoritme hjelper deg med å finne personer som passer til dine preferanser.</li>
          <li><strong>Profilkvalitet:</strong> Alle profiler blir manuelt gjennomgått for å sikre en høy standard og ekte brukeropplevelser.</li>
          <li><strong>Anonym kommunikasjon:</strong> All kommunikasjon skjer anonymt gjennom vår plattform, og din personlige informasjon forblir beskyttet.</li>
          <li><strong>Blokkerings- og filtreringsverktøy:</strong> Du har full kontroll over hvem som kan kontakte deg.</li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Hvorfor velge oss?</h2>
        <ul>
          <li><strong>Tilpasset opplevelse:</strong> Vi har lagt vekt på å lage en plattform som er ryddig og enkel å traversere, 
                      samtidig som at den tilfredstiller de funksjonene man ellers ønsker seg for å finne matcher basert på prinsipper, avstand og alder
                      </li>
          <li><strong>Ekte forbindelser:</strong> Vi legger vekt på kvalitet fremfor kvantitet. 
                      Vi overvåker regelmessig for å sørge for at alle medlemmer på KonservativMatch tilfredstiller kravet om å ha en konservativ holdning, både politisk og kulturelt.
                      </li>
          <li><strong>Sikkerhet:</strong> Din trygghet er vår prioritet. Vi beskytter din informasjon og tilbyr verktøy for å kontrollere hvem som kan kontakte deg.
                      Vi har også gjort det lett for deg å kunne rapporte alle slags former av misbruk, og vi prioriterer å undersøke rapporter raskt og effektivt. 
          </li>
          <li><strong>Fleksibilitet:</strong> Vi har utviklet en fleksibel plattform som man kan logge inn på og enkelt traverse via mobil, nettbrett eller datamaskin.</li>
          <li><strong>Lokalt fokus:</strong> Vi er spesielt designet for det norske konservative markedet, og vi forstår hva brukerne her ser etter.</li>
        </ul>
      </section>

      <section className="conditions-section">
        <h2>Trygghet og sikkerhet</h2>
        <p>
          Vi er opptatt av å tilby en trygg og positiv opplevelse for alle våre brukere. Gjennom strenge retningslinjer
          og kontinuerlig overvåkning av plattformen, jobber vi for å sikre at du kan bruke tjenesten med trygghet. Vi
          oppfordrer alle brukere til å lese våre sikkerhetstips for både nettdating og møter i det virkelige liv.
        </p>
        <p><strong>Kontakt oss:</strong> <a href="mailto:support@konservativmatch.no">support@konservativmatch.no</a>.</p>
      </section>

      {/* <section className="conditions-section">
        <h2>Vårt engasjement for deg</h2>
        <p>
          Hos Klækken Nettjenester er medlemmene vår høyeste prioritet. Vi jobber hver dag for å skape et miljø hvor du
          kan trives, enten du er her for å finne den store kjærligheten eller . Takk for at du
          velger oss – din neste forbindelse kan starte her!
        </p>
        
      </section> */}
    </div>
  );
};

export default AboutUsPage;
