import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>;
const navbar = (
  <Navbar
    projectLink="https://github.com/cupcakearmy/memoir"
    logo={<b>Memoir</b>}
  />
);
const footer = (
  <Footer>
    <span>
      MIT {new Date().getFullYear()} ©{" "}
      <a href="https://github.com/cupcakearmy" target="_blank">
        cupcakearmy
      </a>
      .
    </span>
  </Footer>
);

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <script
          defer
          src="https://spectare.nicco.io//unicorn.js"
          data-website-id="4aecaa6f-1e68-4a21-960a-8ff5aaa6599a"
        ></script>
      </Head>
      <body>
        <Layout
          sidebar={{
            defaultMenuCollapseLevel: 1,
          }}
          feedback={{
            content: "Question? An error? Give feedback →",
          }}
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/cupcakearmy/memoir/blob/main"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
