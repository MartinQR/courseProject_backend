
const getAccesToken = async () => {
  const url = "https://login.salesforce.com/services/oauth2/token";
  const formData = new URLSearchParams();

  formData.append("grant_type", "password");
  formData.append(
    "client_id",
    "3MVG9XgkMlifdwVDVJm9VyCYhR.LCe2nNkgVwmgECwshUYFSef08kglhcku50BGmFthXmdSEhI7yAb7fosWaK"
  );
  formData.append(
    "client_secret",
    "E60E883BA66AA01A43E986022534DDF7F34FEBFC4FF5EE459CDBF023777CA724"
  );
  formData.append("username", "quirozrmartin@gmail.com");
  formData.append("password", "salesforceQuiroz.2");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "User-Agent": "PostmanRuntime/7.42.0",
        Connection: "keep-alive",
        "Accept-Encoding": "gzip, deflate, br",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;

  } catch (error) {
    throw error;
  }
};

const createAccountAndContact = async ({
  accountData,
  contactData,
}) => {

  try {
    const accesToken = await getAccesToken();
    const instanceUrl = "https://quiroz-dev-ed.develop.my.salesforce.com";

    const accountResponse = await fetch(`${instanceUrl}/services/data/v62.0/sobjects/Account/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accesToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountData),
    });

    const account = await accountResponse.json();

    if (account.id) {
      contactData.AccountId = account.id;
      const contactResponse = await fetch(`${instanceUrl}/services/data/v62.0/sobjects/Contact/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const contact = await contactResponse.json();
      if (contact.id) {
        return {
          account,
          contact,
        };
      } else {
        throw new Error("Error creating contact");
      }
    } else {
      throw new Error("Error creating account");
    }


  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAccesToken,
  createAccountAndContact,
};