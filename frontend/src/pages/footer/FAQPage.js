import React, { useState } from 'react';
import '../../styles/footer/FAQPage.css';

const FAQPage = () => {
  const faqData = [
    {
      question: "Hva er KonservativMatch?",
      answer: "KonservativMatch er en plattform som hjelper mennesker med konservative verdier å finne meningsfulle forbindelser basert på felles verdier og ambisjoner."
    },
    {
      question: "Hvordan fungerer plattformen?",
      answer: "Du oppretter en profil, laster opp bilder, og kan deretter utforske og matche med andre brukere. Plattformen er designet for å være enkel, trygg og brukervennlig."
    },
    {
      question: "Er det en kostnad for å bruke KonservativMatch?",
      answer: "Ja, KonservativMatch krever et månedlig abonnement for å få tilgang til alle funksjonene. Dette bidrar til å holde plattformen trygg og godt vedlikeholdt. Vi bruker sikre tredjeparts funksjoner for autentisering, hosting og sikker lagring av brukerdata. Tredjeparts funksjoner er kostbare og det er derfor helt nødvendig for oss å ta betalt for å kunne drifte KonservativMatch på best mulig måte."
    },
    {
      question: "Hvordan kontakter jeg kundeservice?",
      answer: "Du kan kontakte oss ved å sende oss en e-post på support@konservativmatch.no."
    },
    {
      question: "Hvordan sletter jeg kontoen min?",
      answer: "Gå til 'Sikkerhet' som du finner i rullegardinmenyen når du trykker på profilbildet ditt øverst til høyre, og følg instruksjonene for å deaktivere eller slette kontoen din permanent."
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleQuestion = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="faq-page">
      <h1>Vanlige Spørsmål (FAQ)</h1>
      <div className="faq-container">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${expandedIndex === index ? 'expanded' : ''}`}
          >
            <div className="faq-question" onClick={() => toggleQuestion(index)}>
              {faq.question}
            </div>
            {expandedIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;