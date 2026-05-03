const uploadForm = document.getElementById('upload-form');
const characterFileInput = document.getElementById('character-file');
const uploadButton = document.getElementById('upload-button');
const refreshButton = document.getElementById('refresh-button');
const saveStatus = document.getElementById('save-status');
const characterList = document.getElementById('character-list');

const fields = [
  { label: 'Skin', group: 'Colors', type: 'color' },
  { label: 'Clothes', group: 'Colors', type: 'color' },
  { label: 'Hair', group: 'Colors', type: 'color' },
  { label: 'Hair Style', group: 'Styles', type: 'style' },
  { label: 'Eye Style', group: 'Styles', type: 'style' },
  { label: 'Mouth Style', group: 'Styles', type: 'style' },
  { label: 'Hair Size', group: 'Sizes', type: 'percent' },
  { label: 'Eye Size', group: 'Sizes', type: 'percent' },
  { label: 'Mouth Size', group: 'Sizes', type: 'percent' },
  { label: 'Hair X', group: 'Position', type: 'coordinate' },
  { label: 'Hair Y', group: 'Position', type: 'coordinate' },
  { label: 'Eye X', group: 'Position', type: 'coordinate' },
  { label: 'Eye Y', group: 'Position', type: 'coordinate' },
  { label: 'Mouth X', group: 'Position', type: 'coordinate' },
  { label: 'Mouth Y', group: 'Position', type: 'coordinate' },
  { label: 'Mouth Rotation', group: 'Rotation', type: 'degrees' },
  { label: 'Hair Rotation', group: 'Rotation', type: 'degrees' },
  { label: 'Eye Rotation', group: 'Rotation', type: 'degrees' }
];

function setSaveStatus(message) {
  saveStatus.textContent = message;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeHexColor(value) {
  const trimmedValue = String(value).trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmedValue)) {
    return trimmedValue.toLowerCase();
  }

  if (/^[0-9a-f]{6}$/i.test(trimmedValue)) {
    return `#${trimmedValue.toLowerCase()}`;
  }

  return '';
}

function formatNumber(value, options = {}) {
  const number = Number.parseFloat(value);
  if (Number.isNaN(number)) {
    return String(value);
  }

  const roundedNumber = Math.round(number * 10) / 10;
  return options.keepSign ? String(roundedNumber) : String(Math.abs(roundedNumber));
}

function formatStyle(value) {
  const styleNumber = Number.parseInt(value, 10);
  if (Number.isNaN(styleNumber)) {
    return String(value);
  }

  return `Style ${styleNumber}`;
}

function formatCoordinate(value, label) {
  const number = Number.parseFloat(value);
  if (Number.isNaN(number)) {
    return String(value);
  }

  const creatorPosition = -Math.abs(number);
  if (creatorPosition === 0) {
    return 'Centered';
  }

  const distance = formatNumber(creatorPosition);
  if (label.endsWith(' X')) {
    return `${distance} left`;
  }

  if (label.endsWith(' Y')) {
    return `${distance} down`;
  }

  return String(creatorPosition);
}

function createPreviewUrl(characterText) {
  const query = new URLSearchParams({
    preview: '1',
    avatar: characterText
  });

  return `/creator?${query.toString()}`;
}

function createAvatarPreview(character, characterName) {
  return `
    <div class="avatar-preview is-loading" role="img" aria-label="${escapeHtml(characterName)} preview">
      <div class="avatar-preview-loading">PREVIEW LOADING</div>
      <iframe
        class="avatar-preview-frame"
        src="${escapeHtml(createPreviewUrl(character.content))}"
        title="${escapeHtml(characterName)} preview"
      ></iframe>
    </div>
  `;
}

function createDownloadUrl(characterText) {
  const blob = new Blob([characterText], { type: 'text/plain;charset=utf-8' });
  return URL.createObjectURL(blob);
}

function formatDetailValue(line) {
  if (line.type === 'color') {
    const color = normalizeHexColor(line.value);
    if (!color) {
      return escapeHtml(line.value);
    }

    return `
      <span class="color-value">
        <span class="color-swatch" style="background-color: ${escapeHtml(color)}"></span>
        <span>${escapeHtml(color)}</span>
      </span>
    `;
  }

  if (line.type === 'style') {
    return escapeHtml(formatStyle(line.value));
  }

  if (line.type === 'percent') {
    return `${escapeHtml(formatNumber(line.value))}%`;
  }

  if (line.type === 'degrees') {
    return `${escapeHtml(formatNumber(line.value, { keepSign: true }))}deg`;
  }

  if (line.type === 'coordinate') {
    return escapeHtml(formatCoordinate(line.value, line.label));
  }

  return escapeHtml(line.value);
}

function parseCharacterText(text) {
  const normalizedText = String(text)
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n');
  const lineValues = normalizedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
  const lines = lineValues.length >= fields.length
    ? lineValues
    : normalizedText
      .split(/\s*(?:\.\.\.|[,;|]|\r?\n)\s*|\s+/)
      .map((line) => line.trim())
      .filter((line) => line !== '');

  return lines.map((value, index) => {
    const field = fields[index] || {
      label: `Extra Value ${index - fields.length + 1}`,
      group: 'Extra',
      type: 'text'
    };

    return {
      ...field,
      value
    };
  });
}

function createDetailsSection(lines) {
  const groupedLines = lines.reduce((groups, line) => {
    if (!groups[line.group]) {
      groups[line.group] = [];
    }

    groups[line.group].push(line);
    return groups;
  }, {});

  return Object.entries(groupedLines).map(([groupName, groupLines]) => `
    <section class="detail-section">
      <h3>${escapeHtml(groupName)}</h3>
      <div class="details-grid">
        ${groupLines.map((line) => `
          <div>
            <div class="detail-label">${escapeHtml(line.label)}</div>
            <p class="detail-value">${formatDetailValue(line)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function renderCharacters(characters) {
  if (characters.length === 0) {
    characterList.innerHTML = '<section class="box empty-state">No saved characters yet.</section>';
    return;
  }

  characterList.innerHTML = characters.map((character) => {
    const lines = parseCharacterText(character.content);
    const savedDate = new Date(character.updatedAt).toLocaleString();
    const downloadName = character.originalName.endsWith('.txt')
      ? character.originalName
      : `${character.originalName}.txt`;

    return `
      <article class="box character-card">
        ${createAvatarPreview(character, character.originalName)}
        <a
          class="button download-button"
          href="${escapeHtml(createDownloadUrl(character.content))}"
          download="${escapeHtml(downloadName)}"
        >Download Avatar Data</a>
        <h2>${escapeHtml(character.originalName)}</h2>
        <p class="character-meta">Saved ${escapeHtml(savedDate)}</p>
        ${createDetailsSection(lines)}
        <div class="raw-data-title">Raw Data</div>
        <pre class="raw-data">${escapeHtml(character.content)}</pre>
      </article>
    `;
  }).join('');

  document.querySelectorAll('.avatar-preview-frame').forEach((frame) => {
    frame.addEventListener('load', () => {
      setTimeout(() => markPreviewReady(frame), 7000);
    });
  });
}

function markPreviewReady(frame) {
  const preview = frame.closest('.avatar-preview');
  if (!preview || preview.classList.contains('is-ready')) return;

  preview.classList.add('is-ready');
  setTimeout(() => {
    preview.classList.remove('is-loading');
  }, 180);
}

window.addEventListener('message', (event) => {
  if (event.data !== 'character-preview-ready') return;

  document.querySelectorAll('.avatar-preview-frame').forEach((frame) => {
    if (frame.contentWindow === event.source) {
      markPreviewReady(frame);
    }
  });
});

async function loadCharacters() {
  setSaveStatus('Loading characters...');

  const response = await fetch('/api/characters');
  if (!response.ok) {
    throw new Error('Could not load characters.');
  }

  const characters = await response.json();
  renderCharacters(characters);
  setSaveStatus('');
}

async function uploadCharacter(file) {
  const content = await file.text();

  const response = await fetch('/api/characters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filename: file.name,
      content
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Could not save character.' }));
    throw new Error(error.error || 'Could not save character.');
  }
}

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const file = characterFileInput.files[0];
  if (!file) {
    setSaveStatus('Choose a .txt file first.');
    return;
  }

  uploadButton.disabled = true;
  setSaveStatus('Saving character...');

  try {
    await uploadCharacter(file);
    characterFileInput.value = '';
    setSaveStatus('Character saved.');
    await loadCharacters();
  } catch (error) {
    setSaveStatus(error.message);
  } finally {
    uploadButton.disabled = false;
  }
});

refreshButton.addEventListener('click', async () => {
  try {
    await loadCharacters();
  } catch (error) {
    setSaveStatus(error.message);
  }
});

loadCharacters().catch((error) => {
  setSaveStatus(error.message);
});
