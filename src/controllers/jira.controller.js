// filepath: /c:/Users/LeviTC/Desktop/CourseProjectBack/src/controllers/jira.controller.js
const axios = require("axios");

const JIRA_API_KEY = process.env.JIRA_API_KEY;
const PROJECT_KEY = "OPS";
const userName = process.env.JIRA_USERNAME;
const domain = process.env.JIRA_DOMAIN;
const jiraAcountIdAdmin = process.env.JIRA_ACCOUNT_ID_ADMIN;

const createAccount = async (email) => {
  try {
    const bodyData = {
      emailAddress: email,
      "products": [],
      displayName: email,
    };

    const response = await axios.post(
      `https://${domain}.atlassian.net/rest/api/3/user`,
      bodyData,
      {
        headers: {
          "Authorization": `Basic ${Buffer.from(`${userName}:${JIRA_API_KEY}`).toString("base64")}`,
          "Accept": "*/*",
          "Content-Type": "application/json",
        }
      }
    );

    return response.data?.accountId;

  } catch (error) {
    throw error;
  }
};

const createIssue = async ({ summary, description, priority, reportedBy, template, link }) => {
  try {
    const jiraAccountId = await createAccount(reportedBy);

    const descriptionTosend =
      template
        ? `**Template**:\n${template} \n\n **Link**:\n${link} \n\n ${description}`
        : `**Link**:\n${link} \n\n ${description}`;

    const issue = {
      fields: {
        project: {
          key: PROJECT_KEY
        },
        summary: summary,
        description: descriptionTosend,
        issuetype: {
          name: "Task"
        },
        reporter: {
          accountId: jiraAccountId
        },
        priority: {
          name: priority
        },
        assignee: {
          accountId: jiraAcountIdAdmin
        },
      }
    };

    const config = {
      headers: {
        "Authorization": `Basic ${Buffer.from(`${userName}:${JIRA_API_KEY}`).toString("base64")}`,
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(`https://${domain}.atlassian.net/rest/api/2/issue`, issue, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserAccountId = async (email) => {
  const url = `https://${domain}.atlassian.net/rest/api/3/user/search?query=${email}`;

  const config = {
    headers: {
      "Authorization": `Basic ${Buffer.from(`${userName}:${JIRA_API_KEY}`).toString("base64")}`,
      "Accept": "application/json",
    },
  };

  try {
    const response = await axios.get(url, config);
    return response.data?.[0]?.accountId;
  } catch (error) {
    console.error("Error fetching user account ID:", error.response?.data || error.message);
    throw error;
  }
};

const getIssuesCreatedByUser = async (email) => {
  try {
    const url = `https://${domain}.atlassian.net/rest/api/3/search`;
    const accountId = await createAccount(email);

    const jql = `reporter = "${accountId}" ORDER BY created DESC`; // Ordena por fecha de creación

    const config = {
      headers: {
        "Authorization": `Basic ${Buffer.from(`${userName}:${JIRA_API_KEY}`).toString("base64")}`,
        "Accept": "*/*",
      },
      params: {
        jql: jql,
        maxResults: 50, // Número máximo de resultados
        fields: "summary,description,status,created" // Campos que deseas obtener
      },
    };

    const issues = {
      total: 0,
      issues: []
    }

    const response = await axios.get(url, config);

    issues.total = response.data.total;
    issues.issues = response.data.issues?.map((issue) => {
      return {
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        // description: issue.fields.description,
        status: issue.fields.status.name,
        created: issue.fields.created,
      }
    })

    return issues

    return response.data.issues; // Retorna la lista de issues
  } catch (error) {
    console.error("Error fetching issues:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  createAccount,
  getUserAccountId,
  createIssue,
  getIssuesCreatedByUser,
};