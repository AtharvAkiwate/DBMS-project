/* =============================================
   Campus Vote - College Election Website
   Main JavaScript File
   ============================================= */

// =============================================
// Data Management (localStorage)
// =============================================

const StorageKeys = {
  CANDIDATES: 'election_candidates',
  VOTERS: 'election_voters',
  VOTES: 'election_votes'
};

// Get all candidates
function getCandidates() {
  const data = localStorage.getItem(StorageKeys.CANDIDATES);
  return data ? JSON.parse(data) : [];
}

// Save candidates
function saveCandidates(candidates) {
  localStorage.setItem(StorageKeys.CANDIDATES, JSON.stringify(candidates));
}

// Add a new candidate
function addCandidate(candidate) {
  const candidates = getCandidates();
  const newCandidate = {
    ...candidate,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  candidates.push(newCandidate);
  saveCandidates(candidates);
  return newCandidate;
}

// Get candidate by ID
function getCandidateById(id) {
  const candidates = getCandidates();
  return candidates.find(c => c.id === id);
}

// Get all voters
function getVoters() {
  const data = localStorage.getItem(StorageKeys.VOTERS);
  return data ? JSON.parse(data) : [];
}

// Save voters
function saveVoters(voters) {
  localStorage.setItem(StorageKeys.VOTERS, JSON.stringify(voters));
}

// Check if voter has already voted
function hasVoted(voterId) {
  const voters = getVoters();
  return voters.some(v => v.id === voterId);
}

// Record a vote
function recordVote(voterId, voterName, candidateId) {
  if (hasVoted(voterId)) {
    return { success: false, message: 'You have already voted!' };
  }
  
  const voters = getVoters();
  voters.push({
    id: voterId,
    name: voterName,
    votedFor: candidateId,
    votedAt: new Date().toISOString()
  });
  saveVoters(voters);
  return { success: true, message: 'Vote recorded successfully!' };
}

// Get vote counts
function getVoteCounts() {
  const voters = getVoters();
  const counts = {};
  voters.forEach(voter => {
    counts[voter.votedFor] = (counts[voter.votedFor] || 0) + 1;
  });
  return counts;
}

// Get total votes
function getTotalVotes() {
  return getVoters().length;
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// =============================================
// UI Utilities
// =============================================

// Show toast notification
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    ${type === 'success' ? getSVGIcon('check-circle') : getSVGIcon('alert-circle')}
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// SVG Icons
function getSVGIcon(name) {
  const icons = {
    'menu': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>',
    'x': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    'vote': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"></path><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"></path><path d="M22 19H2"></path></svg>',
    'users': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    'user-plus': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>',
    'bar-chart': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>',
    'home': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    'shield': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    'sparkles': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>',
    'graduation-cap': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
    'calendar': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>',
    'id-card': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>',
    'upload': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>',
    'image': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',
    'video': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg>',
    'play': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
    'check': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    'alert-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>',
    'arrow-right': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',
    'arrow-left': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>',
    'chevron-left': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>',
    'chevron-right': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>',
    'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>',
    'trophy': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>',
    'gallery': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>'
  };
  return icons[name] || '';
}

// File to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// =============================================
// Mobile Navigation
// =============================================

function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('mobile-nav-close');
  const overlay = document.getElementById('mobile-nav-overlay');
  
  if (!menuBtn || !mobileNav) return;
  
  menuBtn.addEventListener('click', () => {
    mobileNav.classList.add('open');
  });
  
  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
  };
  
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
  if (overlay) overlay.addEventListener('click', closeMobileNav);
}

// =============================================
// Page-Specific Functions
// =============================================

// Update stats on home page
function updateHomeStats() {
  const candidateCount = document.getElementById('candidate-count');
  const voteCount = document.getElementById('vote-count');
  
  if (candidateCount) {
    candidateCount.textContent = getCandidates().length;
  }
  if (voteCount) {
    voteCount.textContent = getTotalVotes();
  }
}

// Render candidate cards
function renderCandidateCards(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let candidates = getCandidates();
  if (limit) candidates = candidates.slice(0, limit);
  
  if (candidates.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        ${getSVGIcon('users')}
        <h3>No Candidates Yet</h3>
        <p>Be the first to register as a candidate!</p>
        <a href="register.html" class="btn btn-primary">Register Now</a>
      </div>
    `;
    return;
  }
  
  container.innerHTML = candidates.map(candidate => `
    <a href="candidate.html?id=${candidate.id}" class="candidate-card">
      <div class="candidate-image">
        ${candidate.profileImage 
          ? `<img src="${candidate.profileImage}" alt="${candidate.fullName}">`
          : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:4rem;color:var(--muted-light);">${candidate.fullName.charAt(0)}</div>`
        }
        <div class="candidate-symbol">
          ${candidate.symbolType === 'image' && candidate.symbol
            ? `<img src="${candidate.symbol}" alt="Symbol">`
            : candidate.symbol || '?'
          }
        </div>
      </div>
      <div class="candidate-info">
        <h3 class="candidate-name">${candidate.fullName}</h3>
        <div class="candidate-meta">
          <span class="branch">${getSVGIcon('graduation-cap')} ${candidate.branch}</span>
          <span class="year">${getSVGIcon('calendar')} ${candidate.year}</span>
        </div>
        <p class="candidate-description">${candidate.description}</p>
        <div class="view-profile">
          View Profile ${getSVGIcon('arrow-right')}
        </div>
      </div>
    </a>
  `).join('');
}

// =============================================
// Registration Form
// =============================================

function initRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (!form) return;
  
  let campaignMedia = [];
  
  // Symbol type toggle
  const symbolTypeRadios = document.querySelectorAll('input[name="symbolType"]');
  const symbolTextGroup = document.getElementById('symbol-text-group');
  const symbolImageGroup = document.getElementById('symbol-image-group');
  
  symbolTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'text') {
        symbolTextGroup.classList.remove('hidden');
        symbolImageGroup.classList.add('hidden');
      } else {
        symbolTextGroup.classList.add('hidden');
        symbolImageGroup.classList.remove('hidden');
      }
    });
  });
  
  // Profile image preview
  const profileInput = document.getElementById('profileImage');
  const profilePreview = document.getElementById('profile-preview');
  
  profileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      profilePreview.innerHTML = `
        <div class="image-preview">
          <img src="${base64}" alt="Preview">
          <button type="button" class="remove-btn" onclick="removeProfileImage()">
            ${getSVGIcon('x')}
          </button>
        </div>
      `;
    }
  });
  
  // Symbol image preview
  const symbolImageInput = document.getElementById('symbolImage');
  const symbolPreview = document.getElementById('symbol-preview');
  
  symbolImageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      symbolPreview.innerHTML = `
        <div class="image-preview" style="width:80px;height:80px;">
          <img src="${base64}" alt="Symbol Preview">
          <button type="button" class="remove-btn" onclick="removeSymbolImage()">
            ${getSVGIcon('x')}
          </button>
        </div>
      `;
    }
  });
  
  // Campaign media uploads
  const addImagesBtn = document.getElementById('add-images-btn');
  const addVideosBtn = document.getElementById('add-videos-btn');
  const mediaInput = document.getElementById('campaign-media-input');
  const mediaGrid = document.getElementById('media-grid');
  
  addImagesBtn.addEventListener('click', () => {
    mediaInput.accept = 'image/*';
    mediaInput.click();
  });
  
  addVideosBtn.addEventListener('click', () => {
    mediaInput.accept = 'video/*';
    mediaInput.click();
  });
  
  mediaInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const base64 = await fileToBase64(file);
      const mediaItem = {
        id: generateId(),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: base64,
        caption: ''
      };
      campaignMedia.push(mediaItem);
    }
    renderMediaGrid();
    mediaInput.value = '';
  });
  
  function renderMediaGrid() {
    if (campaignMedia.length === 0) {
      mediaGrid.innerHTML = '<p class="text-muted" style="font-size:0.875rem;">No media added yet. Add images or videos to showcase your campaign.</p>';
      return;
    }
    
    mediaGrid.innerHTML = campaignMedia.map(item => `
      <div class="media-item" data-id="${item.id}">
        ${item.type === 'video' 
          ? `<video src="${item.url}"></video><div class="play-icon">${getSVGIcon('play')}</div>`
          : `<img src="${item.url}" alt="Campaign media">`
        }
        <span class="media-type-badge ${item.type}">${item.type}</span>
        <button type="button" class="remove-media" onclick="removeMedia('${item.id}')">
          ${getSVGIcon('x')}
        </button>
        <div class="media-caption">
          <input type="text" placeholder="Add caption..." value="${item.caption}" onchange="updateMediaCaption('${item.id}', this.value)">
        </div>
      </div>
    `).join('');
  }
  
  window.removeMedia = (id) => {
    campaignMedia = campaignMedia.filter(m => m.id !== id);
    renderMediaGrid();
  };
  
  window.updateMediaCaption = (id, caption) => {
    const item = campaignMedia.find(m => m.id === id);
    if (item) item.caption = caption;
  };
  
  window.removeProfileImage = () => {
    profileInput.value = '';
    profilePreview.innerHTML = '';
  };
  
  window.removeSymbolImage = () => {
    symbolImageInput.value = '';
    symbolPreview.innerHTML = '';
  };
  
  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const symbolType = formData.get('symbolType');
    
    let profileImage = '';
    if (profileInput.files[0]) {
      profileImage = await fileToBase64(profileInput.files[0]);
    }
    
    let symbol = '';
    if (symbolType === 'text') {
      symbol = formData.get('symbolText');
    } else if (symbolImageInput.files[0]) {
      symbol = await fileToBase64(symbolImageInput.files[0]);
    }
    
    const candidate = {
      fullName: formData.get('fullName'),
      branch: formData.get('branch'),
      year: formData.get('year'),
      candidateId: formData.get('candidateId'),
      symbolType: symbolType,
      symbol: symbol,
      profileImage: profileImage,
      description: formData.get('description'),
      campaignMedia: campaignMedia
    };
    
    addCandidate(candidate);
    showToast('Registration successful! Your candidacy has been submitted.');
    
    setTimeout(() => {
      window.location.href = 'campaign.html';
    }, 1500);
  });
  
  renderMediaGrid();
}

// =============================================
// Voting Interface
// =============================================

function initVotingInterface() {
  const verificationForm = document.getElementById('verification-form');
  const votingSection = document.getElementById('voting-section');
  const candidatesList = document.getElementById('voting-candidates');
  const submitVoteBtn = document.getElementById('submit-vote-btn');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  
  if (!verificationForm) return;
  
  let currentVoter = null;
  let selectedCandidate = null;
  
  verificationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(verificationForm);
    const voterId = formData.get('voterId');
    const voterName = formData.get('voterName');
    
    if (hasVoted(voterId)) {
      showToast('You have already cast your vote!', 'error');
      return;
    }
    
    currentVoter = { id: voterId, name: voterName };
    
    // Show voting section
    verificationForm.parentElement.classList.add('hidden');
    votingSection.classList.remove('hidden');
    step1.classList.remove('active');
    step1.classList.add('completed');
    step2.classList.add('active');
    
    renderVotingCandidates();
  });
  
  function renderVotingCandidates() {
    const candidates = getCandidates();
    
    if (candidates.length === 0) {
      candidatesList.innerHTML = `
        <div class="empty-state">
          ${getSVGIcon('users')}
          <h3>No Candidates Available</h3>
          <p>There are no registered candidates to vote for.</p>
        </div>
      `;
      submitVoteBtn.disabled = true;
      return;
    }
    
    candidatesList.innerHTML = candidates.map(candidate => `
      <div class="voting-candidate-card" data-id="${candidate.id}" onclick="selectCandidate('${candidate.id}')">
        <div class="voting-candidate-image">
          ${candidate.profileImage 
            ? `<img src="${candidate.profileImage}" alt="${candidate.fullName}">`
            : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--border-light);font-size:1.5rem;color:var(--muted);">${candidate.fullName.charAt(0)}</div>`
          }
        </div>
        <div class="voting-candidate-info">
          <div class="voting-candidate-name">${candidate.fullName}</div>
          <div class="voting-candidate-branch">${candidate.branch} - ${candidate.year}</div>
        </div>
        <div class="voting-check">${getSVGIcon('check')}</div>
      </div>
    `).join('');
  }
  
  window.selectCandidate = (id) => {
    selectedCandidate = id;
    
    document.querySelectorAll('.voting-candidate-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    document.querySelector(`.voting-candidate-card[data-id="${id}"]`).classList.add('selected');
    submitVoteBtn.disabled = false;
  };
  
  submitVoteBtn.addEventListener('click', () => {
    if (!selectedCandidate || !currentVoter) return;
    
    const result = recordVote(currentVoter.id, currentVoter.name, selectedCandidate);
    
    if (result.success) {
      showToast('Your vote has been recorded successfully!');
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 1500);
    } else {
      showToast(result.message, 'error');
    }
  });
}

// =============================================
// Admin/Results Page
// =============================================

function initAdminPage() {
  const resultsContainer = document.getElementById('results-container');
  const totalVotesEl = document.getElementById('total-votes');
  const totalCandidatesEl = document.getElementById('total-candidates');
  
  if (!resultsContainer) return;
  
  const candidates = getCandidates();
  const voteCounts = getVoteCounts();
  const totalVotes = getTotalVotes();
  
  if (totalVotesEl) totalVotesEl.textContent = totalVotes;
  if (totalCandidatesEl) totalCandidatesEl.textContent = candidates.length;
  
  if (candidates.length === 0) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        ${getSVGIcon('bar-chart')}
        <h3>No Results Yet</h3>
        <p>Candidates need to register before results can be shown.</p>
      </div>
    `;
    return;
  }
  
  // Sort by votes
  const sortedCandidates = candidates.map(c => ({
    ...c,
    votes: voteCounts[c.id] || 0
  })).sort((a, b) => b.votes - a.votes);
  
  const maxVotes = Math.max(...sortedCandidates.map(c => c.votes), 1);
  const colors = ['primary', 'accent', 'orange', 'pink'];
  
  resultsContainer.innerHTML = sortedCandidates.map((candidate, index) => {
    const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;
    const isWinner = index === 0 && candidate.votes > 0;
    const color = colors[index % colors.length];
    
    return `
      <div class="results-card">
        <div class="results-header">
          <div class="results-image">
            ${candidate.profileImage 
              ? `<img src="${candidate.profileImage}" alt="${candidate.fullName}">`
              : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--border-light);font-size:1.5rem;color:var(--muted);">${candidate.fullName.charAt(0)}</div>`
            }
          </div>
          <div class="results-info">
            <h3>
              ${candidate.fullName}
              ${isWinner ? `<span class="winner-badge">${getSVGIcon('trophy')} Leading</span>` : ''}
            </h3>
            <p>${candidate.branch} - ${candidate.year}</p>
          </div>
        </div>
        <div class="results-bar">
          <div class="results-bar-fill ${color}" style="width: ${(candidate.votes / maxVotes) * 100}%"></div>
        </div>
        <div class="results-stats">
          <span class="results-votes">${candidate.votes} vote${candidate.votes !== 1 ? 's' : ''}</span>
          <span class="results-percentage">${percentage}%</span>
        </div>
      </div>
    `;
  }).join('');
}

// =============================================
// Candidate Detail Page
// =============================================

function initCandidateDetail() {
  const container = document.getElementById('candidate-detail-container');
  if (!container) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get('id');
  
  if (!candidateId) {
    container.innerHTML = '<div class="empty-state"><h3>Candidate not found</h3><a href="campaign.html" class="btn btn-primary">Back to Campaigns</a></div>';
    return;
  }
  
  const candidate = getCandidateById(candidateId);
  
  if (!candidate) {
    container.innerHTML = '<div class="empty-state"><h3>Candidate not found</h3><a href="campaign.html" class="btn btn-primary">Back to Campaigns</a></div>';
    return;
  }
  
  const media = candidate.campaignMedia || [];
  const images = media.filter(m => m.type === 'image');
  const videos = media.filter(m => m.type === 'video');
  
  container.innerHTML = `
    <a href="campaign.html" class="btn btn-secondary" style="margin-bottom:1.5rem;">
      ${getSVGIcon('arrow-left')} Back to Campaigns
    </a>
    
    <div class="candidate-detail-header">
      <div class="candidate-detail-image">
        ${candidate.profileImage 
          ? `<img src="${candidate.profileImage}" alt="${candidate.fullName}">`
          : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--border-light);font-size:6rem;color:var(--muted);">${candidate.fullName.charAt(0)}</div>`
        }
      </div>
      
      <div class="candidate-detail-info">
        <h1 class="candidate-detail-name">
          ${candidate.fullName}
          <div class="candidate-detail-symbol">
            ${candidate.symbolType === 'image' && candidate.symbol
              ? `<img src="${candidate.symbol}" alt="Symbol">`
              : candidate.symbol || '?'
            }
          </div>
        </h1>
        
        <div class="candidate-detail-meta">
          <div class="candidate-detail-meta-item branch">
            ${getSVGIcon('graduation-cap')}
            ${candidate.branch}
          </div>
          <div class="candidate-detail-meta-item year">
            ${getSVGIcon('calendar')}
            ${candidate.year}
          </div>
          <div class="candidate-detail-meta-item id">
            ${getSVGIcon('id-card')}
            ${candidate.candidateId}
          </div>
        </div>
        
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <a href="vote.html" class="btn btn-primary btn-lg">
            ${getSVGIcon('vote')} Vote for ${candidate.fullName.split(' ')[0]}
          </a>
        </div>
      </div>
    </div>
    
    <div class="manifesto-section">
      <h3>${getSVGIcon('file-text')} Campaign Manifesto</h3>
      <p class="manifesto-text">${candidate.description || 'No manifesto provided.'}</p>
    </div>
    
    ${media.length > 0 ? `
      <div class="gallery-section">
        <div class="gallery-header">
          <h3>${getSVGIcon('gallery')} Campaign Gallery</h3>
          <div class="gallery-counts">
            <span class="gallery-count images">${getSVGIcon('image')} ${images.length} images</span>
            <span class="gallery-count videos">${getSVGIcon('video')} ${videos.length} videos</span>
          </div>
        </div>
        <div class="gallery-grid">
          ${media.map((item, index) => `
            <div class="gallery-item" onclick="openLightbox(${index})">
              ${item.type === 'video'
                ? `<video src="${item.url}"></video><div class="play-overlay">${getSVGIcon('play')}</div>`
                : `<img src="${item.url}" alt="Campaign media">`
              }
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
  
  // Lightbox functionality
  if (media.length > 0) {
    let currentIndex = 0;
    
    window.openLightbox = (index) => {
      currentIndex = index;
      showLightbox();
    };
    
    function showLightbox() {
      const item = media[currentIndex];
      
      let overlay = document.getElementById('lightbox-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'lightbox-overlay';
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
      }
      
      overlay.innerHTML = `
        <div class="modal-content">
          <button class="modal-close" onclick="closeLightbox()">${getSVGIcon('x')}</button>
          ${media.length > 1 ? `<button class="modal-nav prev" onclick="prevMedia()">${getSVGIcon('chevron-left')}</button>` : ''}
          ${item.type === 'video'
            ? `<video src="${item.url}" controls autoplay style="max-width:90vw;max-height:80vh;"></video>`
            : `<img src="${item.url}" alt="Campaign media">`
          }
          ${media.length > 1 ? `<button class="modal-nav next" onclick="nextMedia()">${getSVGIcon('chevron-right')}</button>` : ''}
          ${item.caption ? `<div class="modal-caption">${item.caption}</div>` : ''}
          <div class="modal-caption">${currentIndex + 1} / ${media.length}</div>
        </div>
      `;
      
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    
    window.closeLightbox = () => {
      const overlay = document.getElementById('lightbox-overlay');
      if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    };
    
    window.prevMedia = () => {
      currentIndex = (currentIndex - 1 + media.length) % media.length;
      showLightbox();
    };
    
    window.nextMedia = () => {
      currentIndex = (currentIndex + 1) % media.length;
      showLightbox();
    };
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevMedia();
      if (e.key === 'ArrowRight') nextMedia();
    });
  }
}

// =============================================
// Initialize on DOM Ready
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  updateHomeStats();
  initRegistrationForm();
  initVotingInterface();
  initAdminPage();
  initCandidateDetail();
  
  // Render candidate cards if container exists
  renderCandidateCards('candidates-grid');
  renderCandidateCards('featured-candidates', 3);
});
