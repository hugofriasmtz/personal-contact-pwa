import type { GitHubBranchResponse, GitHubInfoResponse, GitHubRepoResponse } from "../types/github";
import { showToast } from "../utils";

/**
 * Function to fetch GitHub repository and branch information.
 * @returns {Promise<GitHubInfoResponse>} Promise that resolves to an object containing repository and branch data.
 */
export const fetchGitHubInfo = async (): Promise<GitHubInfoResponse> => {
  const username = "hugofriasmtz";
  const repo = "personal-contact-pwa";
  const branch = "main";

  try {
    const [repoResponse, branchResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${username}/${repo}`),
      fetch(`https://api.github.com/repos/${username}/${repo}/branches/${branch}`),
    ]);

    if (repoResponse.ok && branchResponse.ok) {
      const [repoData, branchData] = await Promise.all([
        repoResponse.json() as Promise<GitHubRepoResponse>,
        branchResponse.json() as Promise<GitHubBranchResponse>,
      ]);

      return {
        repoData,
        branchData,
      };
    } else {
      // Check if rate limit exceeded
      if (repoResponse.status === 403 && branchResponse.status === 403) {
        showToast("Límite de velocidad de la API de Github excedido temporalmente para su dirección IP.", {
          type: "error",
          disableVibrate: true,
        });
      } else {
        throw new Error("No se pudo obtener información del repositorio o la rama");
      }
    }
  } catch (error) {
    console.error(error);
    if (navigator.onLine) {
      showToast("No se pudo obtener la API de Github.", { type: "error", disableVibrate: true });
    }
  }
  // Return a default value in case of error
  return { repoData: {}, branchData: {} } as GitHubInfoResponse;
};
