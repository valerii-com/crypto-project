import { Footer } from 'widgets/footer';
import { Header } from 'widgets/header';
import { Layout } from 'shared/ui/layout';
import { ComingSoon } from 'entities/auction/ui/coming-soon';
import { HowItWorks } from 'entities/auction';
import { WelcomeLogo } from 'entities/auction/ui/welcome';

const WelcomePage = () => {
  return (
    <Layout>
      <Header />
      <div className="container">
        <WelcomeLogo />
        <HowItWorks />
      </div>
      <ComingSoon />
      <Footer />
    </Layout>
  );
};

export default WelcomePage;
