document.addEventListener('DOMContentLoaded', () => {
    const githubUsername = 'MorgarAkt';
    const projectContainer = document.getElementById('project-container');
    const paginationControls = document.getElementById('pagination-controls');
    const sections = document.querySelectorAll('section[id]');
    const verticalNavUl = document.querySelector('#vertical-nav ul');

    if (!projectContainer || !paginationControls || !verticalNavUl) {
        console.error("Essential DOM elements not found! Check IDs: project-container, pagination-controls, #vertical-nav ul");
        return;
    }

    let allProjects = [];
    let currentPage = 1;
    const itemsPerPage = 6;
    let totalPages = 0;
    let currentSectionIndex = 0;
    let isScrolling = false;
    const scrollTimeoutDuration = 800;
    let wheelTimeout;
    let touchStartY = 0;
    let touchHandled = false;
    let scrollEndTimer;
    let resizeTimer;

    function centerProjectGrid() {
        if (!projectContainer) return;
        const projectCards = projectContainer.querySelectorAll('a.group');
        if (projectCards.length > 0) {
            projectContainer.style.display = 'inline-grid';
        } else {
            projectContainer.style.display = '';
        }
    }

    function displayProjects(page) {
        currentPage = page;
        projectContainer.innerHTML = '';
        paginationControls.innerHTML = '';

        if (!allProjects || allProjects.length === 0) {
            projectContainer.innerHTML = '<p class="text-center col-span-full text-text-muted italic">No public projects found or failed to load.</p>';
            centerProjectGrid();
            return;
        }

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const projectsToDisplay = allProjects.slice(startIndex, endIndex);

        projectsToDisplay.forEach(project => {
            const projectLink = document.createElement('a');
            projectLink.href = project.html_url;
            projectLink.target = '_blank';
            projectLink.rel = 'noopener noreferrer';
            // MODIFIED: Changed bg-background to bg-surface for consistency
            projectLink.className = 'group block bg-surface rounded-lg shadow-project overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.03] border border-project-border';

            const cardContentWrapper = document.createElement('div');
            cardContentWrapper.className = 'relative flex flex-col h-full';

            const overlayDiv = document.createElement('div');
            overlayDiv.className = 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 ease-in-out z-10 pointer-events-none';
            cardContentWrapper.appendChild(overlayDiv);

            const imgContainer = document.createElement('div');
            imgContainer.className = 'relative w-full h-48 overflow-hidden border-b border-project-border z-0';

            const img = document.createElement('img');
            const ownerLogin = project.owner && project.owner.login ? project.owner.login : githubUsername;
            const potentialThumbnailPaths = [
                `https://raw.githubusercontent.com/${ownerLogin}/${project.name}/main/thumbnail.png`,
                `https://raw.githubusercontent.com/${ownerLogin}/${project.name}/master/thumbnail.png`,
                `https://raw.githubusercontent.com/${ownerLogin}/${project.name}/main/docs/thumbnail.png`,
                `https://raw.githubusercontent.com/${ownerLogin}/${project.name}/main/assets/thumbnail.png`
            ];
            img.alt = `${project.name} Thumbnail`;
            img.className = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105';
            let thumbnailFound = false;
            let currentPathIndex = 0;

            img.onerror = () => {
                currentPathIndex++;
                if (currentPathIndex < potentialThumbnailPaths.length) {
                    img.src = potentialThumbnailPaths[currentPathIndex];
                } else if (!thumbnailFound) {
                    imgContainer.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-surface text-text-muted text-xs italic p-2">No Thumbnail</div>`;
                    img.onerror = null;
                }
            };

            if(potentialThumbnailPaths.length > 0) {
                img.src = potentialThumbnailPaths[currentPathIndex];
                img.onload = () => { thumbnailFound = true; };
            } else {
                 imgContainer.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-surface text-text-muted text-xs italic p-2">Cannot find Thumbnail</div>`;
            }

            imgContainer.appendChild(img);
            cardContentWrapper.appendChild(imgContainer);

            const projectDetails = document.createElement('div');
            projectDetails.className = 'relative p-5 flex flex-col flex-grow z-0';

            const title = document.createElement('h3');
            title.className = 'text-lg font-semibold mb-1 text-text-main';
            title.textContent = project.name.replace(/[-_]/g, ' ');
            projectDetails.appendChild(title);

            if (project.language) {
                const langSpan = document.createElement('span');
                langSpan.className = 'skill-tag inline-block bg-project-bg text-text-main px-3 py-1 rounded-full text-xs font-medium border border-project-border mb-3 self-start';
                langSpan.textContent = project.language;
                projectDetails.appendChild(langSpan);
            }

            const description = document.createElement('p');
            description.className = 'text-text-muted text-sm mb-4 flex-grow';
            let descText = project.description || 'No description available.';
            if (descText.length > 100) {
                 descText = descText.substring(0, 97) + '...';
            }
            description.textContent = descText;
            projectDetails.appendChild(description);

            cardContentWrapper.appendChild(projectDetails);
            projectLink.appendChild(cardContentWrapper);
            projectContainer.appendChild(projectLink);
        });

        centerProjectGrid();
        setupPagination();
    }

    function setupPagination() {
        paginationControls.innerHTML = '';
        if (!allProjects || allProjects.length === 0) return;

        totalPages = Math.ceil(allProjects.length / itemsPerPage);
        if (totalPages <= 1) return;

        const buttonBaseClasses = 'btn btn-light pagination-button text-sm px-4 py-1.5';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.className = buttonBaseClasses;
        prevButton.disabled = (currentPage === 1);
        prevButton.onclick = () => {
            if (currentPage > 1) {
                displayProjects(currentPage - 1);
                smoothScrollTo('projects', 'auto');
            }
        };
        paginationControls.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.className = 'text-sm text-text-muted px-2';
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        paginationControls.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.className = buttonBaseClasses;
        nextButton.disabled = (currentPage === totalPages);
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                displayProjects(currentPage + 1);
                smoothScrollTo('projects', 'auto');
            }
        };
        paginationControls.appendChild(nextButton);
    }

    async function fetchGitHubProjects() {
        projectContainer.innerHTML = '<p class="text-center col-span-full text-text-muted italic">Loading projects...</p>';
        centerProjectGrid();

        let ownedProjects = [];
        const manuallyFetchedRepos = new Map();
        let repoResponseOk = false;

        const manualRepoUrls = [
            // ADD YOUR GITHUB REPO URLS HERE
            // Example: 'https://github.com/owner/repository-name',
        ];


        try {
            const repoApiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=100`;
            const repoResponse = await fetch(repoApiUrl);
            if (!repoResponse.ok) {
                console.warn(`GitHub Repo API Error (Owned): ${repoResponse.status} ${repoResponse.statusText || '(Network issue?)'}. Proceeding without owned repos.`);
            } else {
                ownedProjects = await repoResponse.json();
                repoResponseOk = true;
            }

             if (manualRepoUrls.length > 0) {
                 console.log(`Workspaceing ${manualRepoUrls.length} manually specified repositories...`);
                 await Promise.all(manualRepoUrls.map(async (url) => {
                     const parts = url.replace(/^https?:\/\/github.com\//, '').split('/');
                     if (parts.length >= 2) {
                         const owner = parts[0];
                         const repoName = parts[1];
                         const manualApiUrl = `https://api.github.com/repos/${owner}/${repoName}`;
                         try {
                             const manualResponse = await fetch(manualApiUrl);
                             if (manualResponse.ok) {
                                 const repoData = await manualResponse.json();
                                 const repo = {
                                     id: repoData.id,
                                     name: repoData.name,
                                     full_name: repoData.full_name,
                                     html_url: repoData.html_url,
                                     description: repoData.description,
                                     language: repoData.language,
                                     updated_at: repoData.updated_at,
                                     owner: { login: repoData.owner.login }
                                 };
                                 if (!manuallyFetchedRepos.has(repo.id)) {
                                     manuallyFetchedRepos.set(repo.id, repo);
                                     console.log(`Successfully fetched manual repo: ${repo.full_name}`);
                                 }
                             } else {
                                 console.warn(`GitHub Repo API Error (Manual Fetch): ${manualResponse.status} for ${url}`);
                             }
                         } catch (fetchError) {
                             console.error(`Error fetching manual repo ${url}:`, fetchError);
                         }
                     } else {
                         console.warn(`Invalid manual repository URL format: ${url}`);
                     }
                 }));
             }

            const combinedProjectsMap = new Map();

            ownedProjects.forEach(repo => {
                if (!repo.owner || !repo.owner.login) {
                    repo.owner = { login: githubUsername };
                }
                combinedProjectsMap.set(repo.id, repo);
            });

            manuallyFetchedRepos.forEach((repo, id) => {
                if (!combinedProjectsMap.has(id)) {
                    combinedProjectsMap.set(id, repo);
                }
            });

            allProjects = Array.from(combinedProjectsMap.values());
            allProjects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            if (allProjects.length === 0) {
                 if (!repoResponseOk && manualRepoUrls.length === 0) {
                     projectContainer.innerHTML = `<p class="text-center col-span-full text-red-500 font-semibold">Could not load owned projects and no manual URLs provided. Check console.</p>`;
                 } else {
                     projectContainer.innerHTML = '<p class="text-center col-span-full text-text-muted italic">No public repositories found.</p>';
                 }
                paginationControls.innerHTML = '';
                centerProjectGrid();
            } else {
                displayProjects(1);
            }

        } catch (error) {
            console.error("Critical error within fetchGitHubProjects function:", error);
            projectContainer.innerHTML = `<p class="text-center col-span-full text-red-500 font-semibold">An error occurred while loading projects. Check console for details. Error: ${error.message}</p>`;
            paginationControls.innerHTML = '';
            centerProjectGrid();
        }
    }

     function smoothScrollTo(id, behavior = 'smooth') {
        const element = document.getElementById(id);
        if (element) {
             element.scrollIntoView({ behavior: behavior, block: 'start' });
        } else {
            console.warn(`Scroll target element with ID "${id}" not found.`);
        }
    }

    function findCurrentSection() {
        let closestSectionIndex = 0;
        let minDistance = Infinity;
        const detectionPointY = window.innerHeight * 0.1;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - detectionPointY);

            if (distance < minDistance) {
                minDistance = distance;
                closestSectionIndex = index;
            }
        });
        return closestSectionIndex;
    }

    function createNavDots() {
        verticalNavUl.innerHTML = '';

        sections.forEach((section) => {
            const sectionId = section.id;
            if (!sectionId) return;

            const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' ');
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'nav-dot block w-3 h-3 rounded-full bg-text-muted border-2 border-transparent transition-all duration-300 ease-in-out cursor-pointer hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent';
            a.href = `#${sectionId}`;
            a.dataset.section = sectionId;
            a.setAttribute('aria-label', `Go to ${sectionName} section`);

            a.onclick = function(event) {
                event.preventDefault();
                const targetIndex = Array.from(sections).findIndex(s => s.id === sectionId);
                if (targetIndex !== -1) {
                    if (targetIndex !== currentSectionIndex || !isElementFullyInView(sections[targetIndex])) {
                        navigateSection(0, targetIndex);
                    }
                }
            };

            li.appendChild(a);
            verticalNavUl.appendChild(li);
        });
    }

    function isElementFullyInView(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return Math.abs(rect.top) < 5;
    }

    function updateActiveDot(forcedSectionId = null) {
        let activeSectionId;

        if (forcedSectionId) {
            activeSectionId = forcedSectionId;
        } else {
            const currentIdx = findCurrentSection();
             if (sections[currentIdx] && sections[currentIdx].id) {
                activeSectionId = sections[currentIdx].id;
            } else {
                activeSectionId = sections[0] ? sections[0].id : null;
            }
        }

        const navDots = verticalNavUl.querySelectorAll('.nav-dot');
        navDots.forEach(dot => {
             if (dot.dataset.section === activeSectionId && activeSectionId !== null) {
                dot.classList.add('active', 'bg-accent');
                dot.classList.remove('bg-text-muted');
            } else {
                dot.classList.remove('active', 'bg-accent');
                dot.classList.add('bg-text-muted');
            }
        });
    }

    function navigateSection(direction, targetIdxOverride = null) {
        if (isScrolling) return;

        let targetIndex;

        if (targetIdxOverride !== null) {
             if (targetIdxOverride === currentSectionIndex && isElementFullyInView(sections[currentSectionIndex])) {
                return;
            }
            targetIndex = targetIdxOverride;
        } else {
            targetIndex = currentSectionIndex + direction;
        }

        if (targetIndex >= 0 && targetIndex < sections.length) {
            const targetSection = sections[targetIndex];
             if (!targetSection || !targetSection.id) {
                 console.warn(`Target section at index ${targetIndex} is invalid or missing ID.`);
                 return;
             }

            isScrolling = true;
            const previousSectionIndex = currentSectionIndex;
            currentSectionIndex = targetIndex;
            const targetSectionId = targetSection.id;

            smoothScrollTo(targetSectionId, 'smooth');
            updateActiveDot(targetSectionId);

            setTimeout(() => {
                isScrolling = false;
                const finalIndex = findCurrentSection();
                if (finalIndex !== currentSectionIndex) {
                    currentSectionIndex = finalIndex;
                }
                updateActiveDot();
            }, scrollTimeoutDuration + 100);
        }
    }

    window.addEventListener('scroll', () => {
        clearTimeout(scrollEndTimer);
        if (!isScrolling) {
            scrollEndTimer = setTimeout(() => {
                const newIndex = findCurrentSection();
                if (newIndex !== currentSectionIndex) {
                    currentSectionIndex = newIndex;
                    updateActiveDot();
                } else {
                    updateActiveDot();
                }
            }, 150);
        }
    }, { passive: true });

    window.addEventListener('wheel', (event) => {
         if (event.target.closest('textarea, pre, [data-scrollable]') || Math.abs(event.deltaX) > Math.abs(event.deltaY) || isScrolling) {
             return;
         }
         event.preventDefault();
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (Math.abs(event.deltaY) >= 1) {
                navigateSection(event.deltaY > 0 ? 1 : -1);
            }
        }, 50);
    }, { passive: false });

    window.addEventListener('touchstart', (event) => {
         if (event.target.closest('textarea, pre, [data-scrollable]') || isScrolling) return;
        touchStartY = event.changedTouches[0].screenY;
        touchHandled = false;
    }, { passive: true });

    window.addEventListener('touchend', (event) => {
          if (event.target.closest('textarea, pre, [data-scrollable]') || isScrolling || touchHandled) return;

        const touchEndY = event.changedTouches[0].screenY;
        const swipeDist = touchStartY - touchEndY;
        const swipeThreshold = 50;

        if (Math.abs(swipeDist) > swipeThreshold) {
            touchHandled = true;
            navigateSection(swipeDist > 0 ? 1 : -1);
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            centerProjectGrid();
        }, 250);
    });


    function init() {
        console.log("Initializing Portfolio Script...");
        createNavDots();
        fetchGitHubProjects();

        setTimeout(() => {
             currentSectionIndex = findCurrentSection();
             if (sections[currentSectionIndex] && sections[currentSectionIndex].id) {
                 updateActiveDot();
             } else {
                 console.warn("Initial section detection failed or section has no ID.");
             }
            console.log(`Initial section index determined as: ${currentSectionIndex}`);
        }, 300);
    }

    init();

});