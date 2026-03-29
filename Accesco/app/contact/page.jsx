'use client';


import ContactForm from '../../components/ContactForm';
import SidebarMenu from '../../components/SidebarMenu';
import Footer from '../../components/Footer';

export default function ContactPage() {

  return (
    <>
      <SidebarMenu />
      <main style={{ paddingTop: '0', background: '#fff2eb', minHeight: '100vh' }}>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
