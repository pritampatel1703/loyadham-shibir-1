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
let GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwqA7VYGEKAXTMnmLVP3j59vVwJIFegzm8acOWIUYAIF-S6paZs5vcJ0poLh9XLTdE/exec';

// Clear old cached test URL if present
if (localStorage.getItem('loyadham_script_url') === 'https://script.google.com/macros/s/AKfycbwqA7VYGEKAXTMnmLVP3j59vVwJIFegzm8acOWIUYAIF-S6paZs5vcJ0poLh9XLTdE/exec') {
    localStorage.removeItem('loyadham_script_url');
}
const savedScriptUrl = localStorage.getItem('loyadham_script_url');
if (savedScriptUrl && savedScriptUrl.startsWith('https://script.google.com/')) {
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
        gaam: (fd.get('gaam') || '').trim(),
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
    if (!d.gaam) {
        alert('કૃપા કરીને ગામ દાખલ કરો.');
        document.getElementById('gaam').focus();
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
        // Backend not configured - save locally and show generic message
        showToast('આપની માહિતી સફળતાપૂર્વક નોંધાઈ ગઈ છે!');
        resetForm();
        return;
    }

    btn.classList.add('loading');
    btnSpan.textContent = 'સબમિટ થઈ રહ્યું છે...';

    try {
        // Build payload with individual member fields in separate columns
        const payload = {
            name: d.name,
            gaam: d.gaam,
            age: d.age,
            mobile: d.mobile,
            whatsapp: d.whatsapp || '-',
            address: d.address,
            yearsConnected: d.yearsConnected || '-',
            saintContact: d.saintContact || '-',
            question1: d.question1 || '-',
            question2: d.question2 || '-',
            membersCount: d.members.length,
            submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        // Add each family member's details as separate fields
        // member1_name, member1_relation, member1_age, etc.
        d.members.forEach(function (m, i) {
            var n = i + 1;
            payload['member' + n + '_name'] = m.name || '';
            payload['member' + n + '_relation'] = m.relation || '';
            payload['member' + n + '_age'] = m.age || '';
            payload['member' + n + '_mobile'] = m.mobile || '';
            payload['member' + n + '_from'] = m.from || '';
            payload['member' + n + '_to'] = m.to || '';
            payload['member' + n + '_skill'] = m.skill || '';
            payload['member' + n + '_health'] = m.health || '';
            payload['member' + n + '_seva'] = m.seva || '';
        });

        // POST request to Google Apps Script
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        btn.classList.remove('loading');
        btnSpan.textContent = origText;
        showToast('જય સ્વામિનારાયણ! આપનું ફોર્મ સફળતાપૂર્વક સબમિટ થઈ ગયું છે.');

        setTimeout(() => {
            resetForm();
        }, 1200);

    } catch (err) {
        console.error('Submit error:', err);
        btn.classList.remove('loading');
        btnSpan.textContent = origText;
        alert('ફોર્મ સબમિટ કરવામાં તકલીફ થઈ. કૃપા કરીને થોડી વાર પછી ફરી પ્રયત્ન કરો.');
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
// 8. ON DOM LOADED
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initSaints();
});
