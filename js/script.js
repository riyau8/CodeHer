document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle) {
      navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
      });
    }
  
    // Highlight the active navigation link based on current URL
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  
    // Resource Matching Functionality
    const resourceForm = document.getElementById('resourceForm');
    const careerGoalSelect = document.getElementById('careerGoal');
    const matchedResourcesDiv = document.getElementById('matchedResources');
  
    function matchResources(event) {
      // Prevent form submission refresh
      if (event.type === 'submit') {
        event.preventDefault();
      }
      
      // Log the event type for debugging
      console.log('Event triggered:', event.type);
  
      const careerGoal = careerGoalSelect.value;
      console.log('Career goal selected:', careerGoal);
      
      if (!careerGoal) {
        matchedResourcesDiv.innerHTML = '<p>Please select a career goal to get recommendations.</p>';
        return;
      }
  
      // Pre-defined resource recommendations for each career goal
      const resourceData = {
        webDevelopment: {
          courses: [
            { label: "freeCodeCamp", url: "https://www.freecodecamp.org/" },
            { label: "W3Schools", url: "https://www.w3schools.com/" }
          ],
          youtube: [
            { label: "Traversy Media", url: "https://www.youtube.com/user/TechGuyWeb" },
            { label: "The Net Ninja", url: "https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg" }
          ],
          projects: [
            { label: "Build a Portfolio", url: "#" }
          ],
          codingPlatforms: [
            { label: "CodePen", url: "https://codepen.io/" },
            { label: "JSFiddle", url: "https://jsfiddle.net/" }
          ],
          github: [
            { label: "GitHub Explore", url: "https://github.com/explore" }
          ],
          openSource: [
            { label: "First Contributions", url: "https://firstcontributions.github.io/" }
          ]
        },
        dataScience: {
          courses: [
            { label: "Coursera Data Science", url: "https://www.coursera.org/specializations/jhu-data-science" }
          ],
          youtube: [
            { label: "StatQuest", url: "https://www.youtube.com/user/joshstarmer" }
          ],
          projects: [
            { label: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" }
          ],
          codingPlatforms: [
            { label: "DataCamp", url: "https://www.datacamp.com/" }
          ],
          github: [
            { label: "Awesome Data Science", url: "https://github.com/academic/awesome-datascience" }
          ],
          openSource: [
            { label: "Open Data Science", url: "https://opendatascience.com/" }
          ]
        },
        mobileDevelopment: {
          courses: [
            { label: "Udacity Android Basics", url: "https://www.udacity.com/course/android-basics-nanodegree-by-google--nd803" }
          ],
          youtube: [
            { label: "Android Developers", url: "https://www.youtube.com/user/androiddevelopers" }
          ],
          projects: [
            { label: "Mobile App Project Ideas", url: "#" }
          ],
          codingPlatforms: [
            { label: "Expo (React Native)", url: "https://expo.dev/" }
          ],
          github: [
            { label: "Awesome React Native", url: "https://github.com/jondot/awesome-react-native" }
          ],
          openSource: [
            { label: "React Native Open Source", url: "#" }
          ]
        },
        gameDevelopment: {
          courses: [
            { label: "Unity Learn", url: "https://learn.unity.com/" }
          ],
          youtube: [
            { label: "Brackeys", url: "https://www.youtube.com/user/Brackeys" }
          ],
          projects: [
            { label: "Game Dev Project Ideas", url: "#" }
          ],
          codingPlatforms: [
            { label: "Game Jolt", url: "https://gamejolt.com/" }
          ],
          github: [
            { label: "Awesome Game Development", url: "https://github.com/Calinou/awesome-gamedev" }
          ],
          openSource: [
            { label: "Godot Engine", url: "https://godotengine.org/" }
          ]
        },
        cyberSecurity: {
          courses: [
            { label: "Cybrary", url: "https://www.cybrary.it/" }
          ],
          youtube: [
            { label: "The Cyber Mentor", url: "https://www.youtube.com/channel/UC0ArlFuFYMpEewyRBzdLHiw" }
          ],
          projects: [
            { label: "CTF Challenges", url: "https://ctftime.org/" }
          ],
          codingPlatforms: [
            { label: "Hack The Box", url: "https://www.hackthebox.eu/" }
          ],
          github: [
            { label: "Awesome Cyber Security", url: "https://github.com/sbilly/awesome-cybersecurity" }
          ],
          openSource: [
            { label: "OWASP", url: "https://owasp.org/" }
          ]
        }
      };
  
      // Generate the matching HTML based on the selected career goal
      const selectedResources = resourceData[careerGoal];
      let html = '<h2>Recommended Resources</h2>';
      for (const category in selectedResources) {
        if (selectedResources[category].length > 0) {
          html += `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3><ul>`;
          selectedResources[category].forEach(resource => {
            html += `<li><a href="${resource.url}" target="_blank">${resource.label}</a></li>`;
          });
          html += '</ul>';
        }
      }
      
      // Log the generated HTML for debugging
      console.log('Generated HTML:', html);
      matchedResourcesDiv.innerHTML = html;
    }
  
    if (resourceForm) {
      resourceForm.addEventListener('submit', matchResources);
    }
    if (careerGoalSelect) {
      // Also update when selection changes
      careerGoalSelect.addEventListener('change', matchResources);
    }
  });
  