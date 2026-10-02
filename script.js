/* ==========================================
   LOYADHAM SHIBIR — JAVASCRIPT (v5)
   - Google Sheets Direct Integration
   - Searchable Multi-Select Saints Dropdown (Gujarati + English search)
   - Dynamic Family Members
   - Local Backup Protection
   - Clean PDF Generation
   ========================================== */

// ============================================
// 1. GOOGLE SHEETS CONFIGURATION
// ============================================
// Replace with your deployed Google Apps Script Web App URL:
let GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRREXPgDZzzNO03TKYgfxWyzD6vhE1NpOXLjFjn-ymSABY8nFM927T6tex_9x6jYCa/exec';

// Allow saving the URL in localStorage so you don't lose it if testing
const savedScriptUrl = localStorage.getItem('loyadham_script_url');
if (savedScriptUrl && (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbyRREXPgDZzzNO03TKYgfxWyzD6vhE1NpOXLjFjn-ymSABY8nFM927T6tex_9x6jYCa/exec')) {
    GOOGLE_SCRIPT_URL = savedScriptUrl;
}

// Gujarati numerals helper
const G = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
const gn = n => String(n).split('').map(d => G[+d] || d).join('');

const RELS = [
    ['', '-- સંબંધ --'],
    ['પત્ની', 'પત્ની'],
    ['પતિ', 'પતિ'],
    ['દિકરો', 'દિકરો'],
    ['દિકરી', 'દિકરી'],
    ['માતા', 'માતા'],
    ['પિતા', 'પિતા'],
    ['ભાઈ', 'ભાઈ'],
    ['બહેન', 'બહેન'],
    ['સસરા', 'સસરા'],
    ['સાસુ', 'સાસુ'],
    ['પુત્રવધૂ', 'પુત્રવધૂ'],
    ['જમાઈ', 'જમાઈ'],
    ['પૌત્ર', 'પૌત્ર'],
    ['પૌત્રી', 'પૌત્રી'],
    ['અન્ય', 'અન્ય']
];

let mIdx = 1;

// ============================================
// 2. SAINTS DATA (પૂજ્ય સંતો તથા પાર્ષદો)
// ============================================
const SAINTS_GROUPS = [
    {
        groupName: 'પૂજ્ય સંતોશ્રીઓ',
        items: [
            { gu: 'સ્વામી વિજ્ઞાનસ્વરૂપદાસજી', en: 'swami vignanswarupdasji' },
            { gu: 'સ્વામી સુવ્રતવલ્લભદાસજી', en: 'swami suvratvallabhdasji' },
            { gu: 'સ્વામી શ્રીજીવલ્લભદાસજી', en: 'swami shrijivallabhdasji' },
            { gu: 'સ્વામી દિવ્યવલ્લભદાસજી', en: 'swami divyavallabhdasji' },
            { gu: 'સ્વામી દર્શનવલ્લભદાસજી', en: 'swami darshanvallabhdasji' },
            { gu: 'સ્વામી વિવેકવલ્લભદાસજી', en: 'swami vivekvallabhdasji' },
            { gu: 'સ્વામી નિષ્કામવલ્લભદાસજી', en: 'swami nishkamvallabhdasji' },
            { gu: 'સ્વામી દેવવલ્લભદાસજી', en: 'swami devvallabhdasji' },
            { gu: 'સ્વામી નીલકંઠવલ્લભદાસજી', en: 'swami nilkanthvallabhdasji' },
            { gu: 'સ્વામી નિર્ગુણવલ્લભદાસજી', en: 'swami nirgunvallabhdasji' },
            { gu: 'સ્વામી ભજનવલ્લભદાસજી', en: 'swami bhajanvallabhdasji' },
            { gu: 'સ્વામી સત્સંગવલ્લભદાસજી', en: 'swami satsangvallabhdasji' },
            { gu: 'સ્વામી સરજુવલ્લભદાસજી', en: 'swami sarjuvallabhdasji' },
            { gu: 'સ્વામી પ્રીતમવલ્લભદાસજી', en: 'swami pritamvallabhdasji' },
            { gu: 'સ્વામી ઋષિવલ્લભદાસજી', en: 'swami rushivallabhdasji' },
            { gu: 'સ્વામી યોગીવલ્લભદાસજી', en: 'swami yogivallabhdasji' },
            { gu: 'સ્વામી રસિકવલ્લભદાસજી', en: 'swami rasikvallabhdasji' },
            { gu: 'સ્વામી ધર્મવલ્લભદાસજી', en: 'swami dharmvallabhdasji' },
            { gu: 'સ્વામી ભક્તિવલ્લભદાસજી', en: 'swami bhaktivallabhdasji' },
            { gu: 'સ્વામી પ્રભુવલ્લભદાસજી', en: 'swami prabhuvallabhdasji' },
            { gu: 'સ્વામી કીર્તનવલ્લભદાસજી', en: 'swami kirtanvallabhdasji' },
            { gu: 'સ્વામી અદ્ભુતવલ્લભદાસજી', en: 'swami adbhutvallabhdasji' },
            { gu: 'સ્વામી ધ્યાનવલ્લભદાસજી', en: 'swami dhyanvallabhdasji' },
            { gu: 'સ્વામી આધારવલ્લભદાસજી', en: 'swami aadharvallabhdasji' },
            { gu: 'સ્વામી ધ્યેયવલ્લભદાસજી', en: 'swami dhyeyvallabhdasji' },
            { gu: 'સ્વામી સ્નેહવલ્લભદાસજી', en: 'swami snehvallabhdasji' },
            { gu: 'સ્વામી મંગલવલ્લભદાસજી', en: 'swami mangalvallabhdasji' },
            { gu: 'સ્વામી મુકુંદવલ્લભદાસજી', en: 'swami mukundvallabhdasji' },
            { gu: 'સ્વામી વેદવલ્લભદાસજી', en: 'swami vedvallabhdasji' },
            { gu: 'સ્વામી જ્ઞાનવલ્લભદાસજી', en: 'swami gnanvallabhdasji' },
            { gu: 'સ્વામી નિયમવલ્લભદાસજી', en: 'swami niyamvallabhdasji' },
            { gu: 'સ્વામી મોક્ષવલ્લભદાસજી', en: 'swami mokshvallabhdasji' },
            { gu: 'સ્વામી પરમવલ્લભદાસજી', en: 'swami paramvallabhdasji' }
        ]
    },
    {
        groupName: 'પૂજ્ય પાર્ષદશ્રીઓ (ભગતજી)',
        items: [
            { gu: 'પાર્ષદ રણછોડ ભગત', en: 'parshad ranchhod bhagat' },
            { gu: 'પાર્ષદ મુકુંદ ભગત', en: 'parshad mukund bhagat' },
            { gu: 'પાર્ષદ યોગીરાજ ભગત', en: 'parshad yogiraj bhagat' },
            { gu: 'પાર્ષદ યોગનિધિ ભગત', en: 'parshad yognidhi bhagat' },
            { gu: 'પાર્ષદ બ્રહ્મવિલાસ ભગત', en: 'parshad brahmvilas bhagat' },
            { gu: 'પાર્ષદ તિલક ભગત', en: 'parshad tilak bhagat' },
            { gu: 'પાર્ષદ મહર્ષિ ભગત', en: 'parshad maharshi bhagat' },
            { gu: 'પાર્ષદ દેવર્ષિ ભગત', en: 'parshad devarshi bhagat' },
            { gu: 'પાર્ષદ બ્રહ્મર્ષિ ભગત', en: 'parshad brahmarshi bhagat' },
            { gu: 'પાર્ષદ ગોપાલ ભગત', en: 'parshad gopal bhagat' },
            { gu: 'પાર્ષદ હરિકૃષ્ણ ભગત', en: 'parshad harikrishna bhagat' },
            { gu: 'પાર્ષદ હરિદેવ ભગત', en: 'parshad haridev bhagat' },
            { gu: 'પાર્ષદ હરિઓમ ભગત', en: 'parshad hariom bhagat' }
        ]
    }
];

let selectedSaints = [];

// Initialize Saints UI
function initSaints() {
    const listEl = document.getElementById('saintList');
    if (!listEl) return;
    listEl.innerHTML = '';

    SAINTS_GROUPS.forEach(grp => {
        const grpLbl = document.createElement('div');
        grpLbl.className = 'saint-group-label';
        grpLbl.textContent = grp.groupName;
        listEl.appendChild(grpLbl);

        grp.items.forEach(saint => {
            const opt = document.createElement('div');
            opt.className = 'saint-option';
            opt.dataset.gu = saint.gu;
            opt.dataset.en = saint.en;
            opt.onclick = () => toggleSaint(saint.gu);

            opt.innerHTML = `
                <div class="saint-check">
                    <svg class="saint-check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <span>${saint.gu}</span>
            `;
            listEl.appendChild(opt);
        });
    });

    updateSaintTrigger();
}

function toggleSaintDropdown(e) {
    if (e) e.stopPropagation();
    const trigger = document.getElementById('saintTrigger');
    const dropdown = document.getElementById('saintDropdown');
    const isOpen = dropdown.classList.toggle('open');
    trigger.classList.toggle('open', isOpen);

    if (isOpen) {
        const searchInput = document.getElementById('saintSearch');
        if (searchInput) {
            searchInput.value = '';
            filterSaints();
            setTimeout(() => searchInput.focus(), 60);
        }
    }
}

function filterSaints() {
    const q = (document.getElementById('saintSearch')?.value || '').trim().toLowerCase();
    const options = document.querySelectorAll('.saint-option');
    const labels = document.querySelectorAll('.saint-group-label');

    options.forEach(opt => {
        const gu = opt.dataset.gu.toLowerCase();
        const en = opt.dataset.en.toLowerCase();
        const match = gu.includes(q) || en.includes(q);
        opt.style.display = match ? 'flex' : 'none';
    });

    // Handle group label visibility
    labels.forEach(lbl => {
        let next = lbl.nextElementSibling;
        let anyVisible = false;
        while (next && !next.classList.contains('saint-group-label')) {
            if (next.style.display !== 'none') anyVisible = true;
            next = next.nextElementSibling;
        }
        lbl.style.display = anyVisible ? 'block' : 'none';
    });
}

function toggleSaint(name) {
    const idx = selectedSaints.indexOf(name);
    if (idx === -1) {
        selectedSaints.push(name);
    } else {
        selectedSaints.splice(idx, 1);
    }
    updateSaintTrigger();
}

function removeSaintTag(name, e) {
    if (e) e.stopPropagation();
    selectedSaints = selectedSaints.filter(s => s !== name);
    updateSaintTrigger();
}

function updateSaintTrigger() {
    const trigger = document.getElementById('saintTrigger');
    const hidden = document.getElementById('saintContact');
    if (!trigger || !hidden) return;

    hidden.value = selectedSaints.join(', ');

    // Update selected class on options
    document.querySelectorAll('.saint-option').forEach(opt => {
        const isSelected = selectedSaints.includes(opt.dataset.gu);
        opt.classList.toggle('selected', isSelected);
    });

    if (selectedSaints.length === 0) {
        trigger.innerHTML = `
            <span class="saint-placeholder" id="saintPlaceholder">સંત પસંદ કરો...</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        `;
    } else {
        const tagsHtml = selectedSaints.map(name => `
            <span class="saint-tag">
                ${name}
                <span class="saint-tag-x" onclick="removeSaintTag('${name}', event)">✕</span>
            </span>
        `).join('');

        trigger.innerHTML = `
            <div style="display:flex; flex-wrap:wrap; gap:4px; align-items:center; flex:1;">
                ${tagsHtml}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        `;
    }
}

// Close dropdown on click outside
document.addEventListener('click', (e) => {
    const wrap = document.getElementById('saintSelect');
    const dropdown = document.getElementById('saintDropdown');
    const trigger = document.getElementById('saintTrigger');
    if (wrap && !wrap.contains(e.target) && dropdown && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        trigger.classList.remove('open');
    }
});

// ============================================
// 3. FAMILY MEMBER CARDS
// ============================================
function addMember() {
    const wrap = document.getElementById('membersWrap');
    const idx = mIdx++;
    const opts = RELS.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');

    const el = document.createElement('div');
    el.className = 'member-card';
    el.dataset.idx = idx;
    el.id = 'mc' + idx;
    el.innerHTML = `
        <div class="mc-head">
            <div class="mc-num">${gn(wrap.children.length + 1)}</div>
            <div class="mc-badge mc-badge-secondary">સભ્ય</div>
            <button type="button" class="mc-remove" onclick="removeMember(${idx})" title="દૂર કરો">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="mc-body">
            <div class="mc-row">
                <div class="mc-field mc-f-half"><label>નામ</label><input type="text" name="m_name_${idx}" placeholder="નામ"></div>
                <div class="mc-field mc-f-quarter"><label>સંબંધ</label><select name="m_rel_${idx}">${opts}</select></div>
                <div class="mc-field mc-f-quarter"><label>ઉંમર</label><input type="number" name="m_age_${idx}" placeholder="ઉંમર" min="1" max="120"></div>
            </div>
            <div class="mc-row">
                <div class="mc-field mc-f-half"><label>મો. નંબર</label><input type="tel" name="m_mob_${idx}" placeholder="મોબાઈલ" maxlength="10"></div>
                <div class="mc-field mc-f-half"><label>રોકાણ તારીખ</label>
                    <div class="mc-dates">
                        <input type="date" name="m_from_${idx}" min="2026-11-08" max="2026-11-14">
                        <span>થી</span>
                        <input type="date" name="m_to_${idx}" min="2026-11-08" max="2026-11-14">
                    </div>
                </div>
            </div>
            <div class="mc-row">
                <div class="mc-field mc-f-third"><label>આવડત</label><input type="text" name="m_skill_${idx}" placeholder="આવડત"></div>
                <div class="mc-field mc-f-third"><label>શારીરિક તકલીફ</label><input type="text" name="m_health_${idx}" placeholder="જો હોય"></div>
                <div class="mc-field mc-f-third"><label>સેવામાં રુચિ</label><input type="text" name="m_seva_${idx}" placeholder="સેવા"></div>
            </div>
        </div>`;

    wrap.appendChild(el);
    renum();
    el.querySelector(`[name="m_name_${idx}"]`)?.focus();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeMember(idx) {
    const c = document.getElementById('mc' + idx);
    if (!c) return;
    c.style.transition = 'opacity .25s, transform .25s';
    c.style.opacity = '0';
    c.style.transform = 'scale(0.96)';
    setTimeout(() => { c.remove(); renum(); }, 250);
}

function renum() {
    document.querySelectorAll('#membersWrap .member-card').forEach((c, i) => {
        const n = c.querySelector('.mc-num');
        if (n) n.textContent = gn(i + 1);
    });
}

// ============================================
// 4. DATA COLLECTION (Without formNo)
// ============================================
function collect() {
    const fd = new FormData(document.getElementById('shibirForm'));
    const d = {
        name: (fd.get('name') || '').trim(),
        age: (fd.get('age') || '').trim(),
        mobile: (fd.get('mobile') || '').trim(),
        whatsapp: (fd.get('whatsapp') || '').trim(),
        address: (fd.get('address') || '').trim(),
        yearsConnected: (fd.get('yearsConnected') || '').trim(),
        saintContact: selectedSaints.join(', '),
        question1: (fd.get('question1') || '').trim(),
        question2: (fd.get('question2') || '').trim(),
        submittedAt: new Date().toISOString(),
        members: []
    };

    document.querySelectorAll('#membersWrap .member-card').forEach(c => {
        const i = c.dataset.idx;
        const m = {
            name: (fd.get('m_name_' + i) || '').trim(),
            relation: (fd.get('m_rel_' + i) || '').trim(),
            age: (fd.get('m_age_' + i) || '').trim(),
            mobile: (fd.get('m_mob_' + i) || '').trim(),
            from: (fd.get('m_from_' + i) || '').trim(),
            to: (fd.get('m_to_' + i) || '').trim(),
            skill: (fd.get('m_skill_' + i) || '').trim(),
            health: (fd.get('m_health_' + i) || '').trim(),
            seva: (fd.get('m_seva_' + i) || '').trim()
        };
        if (m.name) d.members.push(m);
    });

    return d;
}

// ============================================
// 5. SUBMISSION TO GOOGLE SHEETS
// ============================================
document.getElementById('shibirForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const btnSpan = btn.querySelector('span') || btn;
    const origText = btnSpan.textContent;

    const d = collect();

    // Field Validation
    if (!d.name) {
        alert('કૃપા કરીને પૂરું નામ દાખલ કરો.');
        document.getElementById('name').focus();
        return;
    }
    if (!d.age) {
        alert('કૃપા કરીને ઉંમર દાખલ કરો.');
        document.getElementById('age').focus();
        return;
    }
    if (!d.mobile || d.mobile.length !== 10) {
        alert('કૃપા કરીને ૧૦ અંકનો સાચો મોબાઈલ નંબર દાખલ કરો.');
        document.getElementById('mobile').focus();
        return;
    }
    if (!d.address) {
        alert('કૃપા કરીને સરનામું દાખલ કરો.');
        document.getElementById('address').focus();
        return;
    }

    // Always backup to LocalStorage first (Zero data loss guarantee)
    try {
        const existing = JSON.parse(localStorage.getItem('loyadham_shibir_submissions') || '[]');
        existing.push(d);
        localStorage.setItem('loyadham_shibir_submissions', JSON.stringify(existing));
    } catch (e) {
        console.warn('LocalStorage backup error:', e);
    }

    // Check if Google Apps Script URL is set
    const isUrlConfigured = GOOGLE_SCRIPT_URL &&
        GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' &&
        GOOGLE_SCRIPT_URL.startsWith('https://script.google.com');

    if (!isUrlConfigured) {
        const userEnteredUrl = prompt(
            'Google Sheets સાથે જોડવા માટે આપનું Google Apps Script Web App URL દાખલ કરો:\n\n' +
            '(જો હજુ બનાવી નથી, તો Cancel કરો - વિગતો સેવ થઈ જશે અને માર્ગદર્શિકા જુઓ)',
            ''
        );

        if (userEnteredUrl && userEnteredUrl.trim().startsWith('https://script.google.com')) {
            GOOGLE_SCRIPT_URL = userEnteredUrl.trim();
            localStorage.setItem('loyadham_script_url', GOOGLE_SCRIPT_URL);
        } else {
            // URL not provided yet - show success locally and notify user
            showToast('માહિતી સફળતાપૂર્વક સાચવવામાં આવી છે! (Google Sheets URL કનેક્ટ કરવાનું બાકી છે)');
            resetForm();
            return;
        }
    }

    btn.classList.add('loading');
    btnSpan.textContent = 'સબમિટ થઈ રહ્યું છે...';

    try {
        // Flatten members into readable text for Google Sheet row
        const membersStr = d.members.map((m, i) =>
            `${i + 1}. ${m.name} (${m.relation || '-'}) [ઉંમર:${m.age || '-'} મો:${m.mobile || '-'} રોકાણ:${m.from || '-'} થી ${m.to || '-'} આવડત:${m.skill || '-'} તકલીફ:${m.health || '-'} સેવા:${m.seva || '-'}]`
        ).join(' | ');

        const payload = {
            name: d.name,
            age: d.age,
            mobile: d.mobile,
            whatsapp: d.whatsapp || '-',
            address: d.address,
            yearsConnected: d.yearsConnected || '-',
            saintContact: d.saintContact || '-',
            question1: d.question1 || '-',
            question2: d.question2 || '-',
            membersCount: d.members.length,
            members: membersStr || '-',
            submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        // POST request to Google Apps Script
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        btn.classList.remove('loading');
        btnSpan.textContent = origText;
        showToast('સફળ! ફોર્મ સફળતાપૂર્વક Google Sheets માં સબમિટ થઈ ગયું છે.');

        setTimeout(() => {
            resetForm();
        }, 1200);

    } catch (err) {
        console.error('Submit error:', err);
        btn.classList.remove('loading');
        btnSpan.textContent = origText;
        alert('Google Sheets માં મોકલવામાં તકલીફ થઈ. પરંતુ માહિતી બ્રાઉઝરમાં સુરક્ષિત સાચવી લેવાઈ છે.\n\nError: ' + err.message);
    }
});

function resetForm() {
    document.getElementById('shibirForm').reset();
    selectedSaints = [];
    updateSaintTrigger();

    // Reset family members to only card 0
    const cards = document.querySelectorAll('#membersWrap .member-card');
    cards.forEach((card, i) => {
        if (i > 0) card.remove();
    });
    renum();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// 6. TOAST
// ============================================
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    if (msg) {
        const span = t.querySelector('.toast-body span');
        if (span) span.textContent = msg;
    }
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 5000);
}

// ============================================
// 7. PDF GENERATION
// ============================================
function generatePDF() {
    const btn = document.getElementById('pdfBtn');
    const origHtml = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = `
        <svg style="animation: spin 1s linear infinite;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        <span>PDF બની રહ્યું છે...</span>
    `;

    const d = collect();

    // CRITICAL: html2canvas requires the element to be FULLY VISIBLE (opacity:1,
    // no negative z-index) to compute non-zero height. We use position:fixed
    // covering the entire viewport with a white background. The brief flash
    // looks like a loading overlay. It's removed immediately after capture.
    const el = document.createElement('div');
    el.id = 'pdfRenderContainer';
    el.innerHTML = pdfHTML(d);
    el.style.cssText = [
        'position: fixed',
        'left: 0',
        'top: 0',
        'width: 780px',
        'height: auto',
        'max-height: 100vh',
        'overflow-y: auto',
        'background: #ffffff',
        'z-index: 99999',
        'padding: 16px 24px',
        'box-sizing: border-box',
        'font-family: sans-serif',
        'font-size: 13px',
        'line-height: 1.5',
        'color: #222'
    ].join(';');
    document.body.appendChild(el);

    // Allow layout + fonts to settle (300ms)
    setTimeout(function () {
        // Force the container to exactly 780px for capture
        el.style.width = '780px';

        html2pdf().set({
            margin: [8, 8, 8, 8],
            filename: 'loyadham_shibir_registration.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                scrollY: 0,
                scrollX: 0,
                width: 780
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(el).toPdf().get('pdf').then(async function (pdfObj) {
            // Remove render overlay immediately
            if (el.parentNode) el.parentNode.removeChild(el);

            // Get PDF as raw arraybuffer
            var arrBuf = pdfObj.output('arraybuffer');
            var pdfBlob = new Blob([arrBuf], { type: 'application/pdf' });

            // Strategy 1: Native "Save As" dialog (works perfectly on localhost)
            if (window.showSaveFilePicker) {
                try {
                    var handle = await window.showSaveFilePicker({
                        suggestedName: 'loyadham_shibir_registration.pdf',
                        types: [{
                            description: 'PDF Document',
                            accept: { 'application/pdf': ['.pdf'] }
                        }]
                    });
                    var writable = await handle.createWritable();
                    await writable.write(pdfBlob);
                    await writable.close();
                    btn.classList.remove('loading');
                    btn.innerHTML = origHtml;
                    showToast('PDF સફળતાપૂર્વક સેવ થઈ ગયું છે!');
                    return;
                } catch (e) {
                    // User cancelled the save dialog, or API failed
                    if (e.name === 'AbortError') {
                        btn.classList.remove('loading');
                        btn.innerHTML = origHtml;
                        return;
                    }
                }
            }

            // Strategy 2: Open PDF in new tab (user can Ctrl+S to save)
            var blobUrl = URL.createObjectURL(pdfBlob);
            window.open(blobUrl, '_blank');
            setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 60000);

            btn.classList.remove('loading');
            btn.innerHTML = origHtml;
            showToast('PDF નવી ટેબમાં ખુલ્યું છે — Ctrl+S દબાવીને સેવ કરો!');
        }).catch(function (err) {
            console.error('PDF generation error:', err);
            if (el.parentNode) el.parentNode.removeChild(el);
            btn.classList.remove('loading');
            btn.innerHTML = origHtml;
            // Fallback: browser's native print dialog (user can "Save as PDF")
            alert('PDF ડાઉનલોડ ન થયું. "પ્રિન્ટ કરો" બટન વાપરીને Save as PDF કરો.');
        });
    }, 300);
}

function pdfHTML(d) {
    const rows = d.members.map((m, i) => `<tr>
        <td style="text-align:center;padding:5px;border:1px solid #ddd;font-size:11px;">${i + 1}</td>
        <td style="padding:5px 6px;border:1px solid #ddd;font-size:11px;">${m.name}</td>
        <td style="padding:5px 6px;border:1px solid #ddd;font-size:11px;">${m.relation || '-'}</td>
        <td style="text-align:center;padding:5px;border:1px solid #ddd;font-size:11px;">${m.age || '-'}</td>
        <td style="padding:5px 6px;border:1px solid #ddd;font-size:11px;">${m.mobile || '-'}</td>
        <td style="padding:5px 6px;border:1px solid #ddd;font-size:11px;">${m.from || '-'} ${(m.from || m.to) ? 'થી' : ''} ${m.to || '-'}</td>
        <td style="padding:5px 6px;border:1px solid #ddd;font-size:11px;">${m.skill || '-'}</td>
        <td style="padding:5px 6px;border:1px solid #ddd;font-size:11px;">${m.health || '-'}</td>
        <td style="padding:5px 6px;border:1px solid #ddd;font-size:11px;">${m.seva || '-'}</td>
    </tr>`).join('');

    return `
    <div style="font-family:'Noto Sans Gujarati',sans-serif;color:#2c2c3a;padding:16px;max-width:780px;">
        <div style="text-align:center;border:2px solid #d06810;border-radius:10px;padding:18px;margin-bottom:16px;background:#fff8f0;">
            <h1 style="color:#ac4f0e;font-size:18px;margin-bottom:4px;">"જય શ્રી સ્વામિનારાયણ"</h1>
            <p style="font-size:12px;color:#6b6b80;margin-bottom:3px;">શ્રી સ્વામિનારાયણ મંદિર લોયાધામ આયોજીત</p>
            <div style="display:inline-block;padding:4px 18px;background:linear-gradient(135deg,#e8801a,#d06810);border-radius:20px;color:#fff;font-size:14px;font-weight:bold;margin:6px 0;">"લોયાધામ શિબિર – ૧"</div>
            <p style="font-size:11px;color:#6b6b80;margin:4px 0;">૦૮/૧૧/૨૦૨૬ (રવિવાર) થી ૧૪/૧૧/૨૦૨૬ (શનિવાર)</p>
            <p style="font-size:11px;color:#6b6b80;">પ્રેરક: પ.પૂ.સ.ગુ.શા.શ્રી ઘનશ્યામપ્રકાશદાસજી સ્વામી</p>
        </div>

        <div style="border:1px solid #e2ddd5;border-radius:8px;padding:14px;margin-bottom:14px;">
            <h3 style="color:#ac4f0e;font-size:13px;border-bottom:1px solid #e2ddd5;padding-bottom:6px;margin-bottom:10px;">વ્યક્તિગત માહિતી</h3>
            <table style="width:100%;font-size:11px;border-collapse:collapse;">
                <tr>
                    <td style="padding:4px 6px;width:22%;color:#6b6b80;"><strong>નામ:</strong></td>
                    <td style="padding:4px 6px;border-bottom:1px solid #e2ddd5;" colspan="3"><strong>${d.name}</strong></td>
                </tr>
                <tr>
                    <td style="padding:4px 6px;color:#6b6b80;"><strong>ઉંમર:</strong></td>
                    <td style="padding:4px 6px;border-bottom:1px solid #e2ddd5;">${d.age}</td>
                    <td style="padding:4px 6px;width:20%;color:#6b6b80;"><strong>મોબાઈલ:</strong></td>
                    <td style="padding:4px 6px;border-bottom:1px solid #e2ddd5;">${d.mobile}</td>
                </tr>
                <tr>
                    <td style="padding:4px 6px;color:#6b6b80;"><strong>વોટ્સએપ:</strong></td>
                    <td style="padding:4px 6px;border-bottom:1px solid #e2ddd5;">${d.whatsapp || '-'}</td>
                    <td style="padding:4px 6px;color:#6b6b80;"><strong>વર્ષો જોડાયેલા:</strong></td>
                    <td style="padding:4px 6px;border-bottom:1px solid #e2ddd5;">${d.yearsConnected || '-'}</td>
                </tr>
                <tr>
                    <td style="padding:4px 6px;color:#6b6b80;"><strong>સરનામું:</strong></td>
                    <td colspan="3" style="padding:4px 6px;border-bottom:1px solid #e2ddd5;">${d.address}</td>
                </tr>
                <tr>
                    <td style="padding:4px 6px;color:#6b6b80;"><strong>સંતો સંપર્ક:</strong></td>
                    <td colspan="3" style="padding:4px 6px;">${d.saintContact || '-'}</td>
                </tr>
            </table>
        </div>

        ${d.members.length ? `
        <div style="border:1px solid #e2ddd5;border-radius:8px;padding:14px;margin-bottom:14px;">
            <h3 style="color:#ac4f0e;font-size:13px;border-bottom:1px solid #e2ddd5;padding-bottom:6px;margin-bottom:10px;">પરિવારના સભ્યો</h3>
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="background:#fff8f0;">
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">ક્રમ</th>
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">નામ</th>
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">સંબંધ</th>
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">ઉંમર</th>
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">મો.નં.</th>
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">રોકાણ તારીખ</th>
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">આવડત</th>
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">તકલીફ</th>
                        <th style="padding:5px;border:1px solid #ddd;font-size:10px;color:#ac4f0e;">સેવા</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>` : ''}

        ${(d.question1 || d.question2) ? `
        <div style="border:1px solid #e2ddd5;border-radius:8px;padding:14px;margin-bottom:14px;">
            <h3 style="color:#ac4f0e;font-size:13px;border-bottom:1px solid #e2ddd5;padding-bottom:6px;margin-bottom:10px;">જાણવાની ઈચ્છા</h3>
            ${d.question1 ? `<p style="font-size:11px;margin-bottom:6px;"><strong>૧)</strong> ${d.question1}</p>` : ''}
            ${d.question2 ? `<p style="font-size:11px;"><strong>૨)</strong> ${d.question2}</p>` : ''}
        </div>` : ''}

        <div style="text-align:center;font-size:10px;color:#9e9eab;margin-top:16px;padding-top:10px;border-top:1px solid #e2ddd5;">
            <p style="color:#d06810;font-weight:700;">॥ જય શ્રી સ્વામિનારાયણ ॥</p>
            <p style="margin-top:2px;">શ્રી સ્વામિનારાયણ મંદિર, લોયાધામ</p>
        </div>
    </div>`;
}

// ============================================
// 8. ON DOM LOADED
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initSaints();
});
