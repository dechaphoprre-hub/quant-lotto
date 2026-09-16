import { MarketType } from '../types';

export type Language = 'TH' | 'LA' | 'VN' | 'EN';

export interface MarketTranslation {
  name: string;
  schedule: string;
}

export interface Translations {
  // General & Navbar
  sysActive: string;
  engineName: string;
  guideButton: string;
  langSelect: string;
  terminalTab: string;
  heatmapTab: string;
  warRoomTab: string;
  proofTab: string;
  countdownTitle: string;
  latestDrawTitle: string;
  topTwoDigit: string;
  bottomTwoDigit: string;
  algorithmIndex: string;
  highAccuracy: string;
  quantPool: string;
  simulationsLabel: string;
  backtestNote: string;
  convergenceNote: string;
  drawDatePrefix: string;

  // 2D vs 3D Dimension Mode Switcher
  mode2D: string;
  mode3D: string;
  frontThreeDigit: string;
  backThreeDigit: string;
  topThreeDigit: string;
  patternHaam: string;
  patternDouble: string;
  patternClean: string;
  patternTriple: string;
  patternDistTitle: string;
  patternDistDesc: string;
  sumRootLabel: string;
  payoutComparison: string;
  liveClockLabel: string;
  drawTodayAlertTitle: string;
  drawTodayAlertSub: string;
  drawTodayBadge: string;
  drawLiveAlertTitle: string;
  drawLiveAlertSub: string;
  drawLiveBadge: string;
  drawTomorrowAlertTitle: string;
  drawTomorrowAlertSub: string;
  drawTomorrowBadge: string;
  eventRadarTitle: string;
  eventRadarSub: string;
  todayLabel: string;
  tomorrowLabel: string;
  analyzeMarketBtn: string;
  superDrawDayBadge: string;
  majorEventBadge: string;
  
  markets: Record<MarketType, MarketTranslation>;

  // Engine 1
  engine1Title: string;
  engine1Badge: string;
  engine1Desc: string;
  engine1Button: string;
  engine1Computing: string;
  engine1TopTitle: string;
  engine1ConfLevel: string;
  
  // Engine 2
  engine2Title: string;
  engine2Badge: string;
  engine2Desc: string;
  engine2Select: string;
  engine2Result: string;
  
  // Engine 3
  engine3Title: string;
  engine3Badge: string;
  engine3Desc: string;
  hotTitle: string;
  coldTitle: string;
  hotSub: string;
  coldSub: string;
  engine3Note: string;
  
  // Heatmap
  heatmapTitle: string;
  heatmapDesc: string;
  legendHot: string;
  legendCold: string;
  legendAboveAvg: string;
  legendBaseline: string;
  dossierEnergyStatus: string;
  dossierDrawCount: string;
  dossierDrawsAbsent: string;
  dossierJustDrawn: string;
  dossierAbsenceLabel: string;
  dossierEvalTitle: string;
  dossierEvalHot: string;
  dossierEvalCold: string;
  dossierEvalNeutral: string;
  dossierCloseBtn: string;
  
  // War Room
  warRoomTitle: string;
  warRoomDesc: string;
  warRoomButton: string;
  warRoomTens: string;
  warRoomUnits: string;
  warRoomLocked: string;
  warRoomWinner: string;
  warRoomAwaiting: string;
  warRoomShrunk: string;
  warRoomCompleted: string;
  warRoomInstruction: string;
  warRoomEliminatedNotice: string;
  warRoomResultPrefix: string;
  warRoomVerifiedEngine: string;
  warRoomResetBtn: string;
  
  // Proof
  proofTitle: string;
  proofBadge: string;
  proofDesc: string;
  proofHitRateLabel: string;
  proofVerifiedDrawsLabel: string;
  proofDrawUnit: string;
  proofGuaranteeTitle: string;
  proofGuaranteeText: string;
  proofTableTitle: string;
  proofAuditedBadge: string;
  proofThDateMarket: string;
  proofThPredictions: string;
  proofThActual: string;
  proofThResult: string;
  proofThHash: string;
  proofCopied: string;

  // Guide Modal
  guideTitle: string;
  guideSub: string;
  guideChapter1Title: string;
  guideChapter1Desc: string;
  guideChapter2Title: string;
  guideChapter2Desc: string;
  guideChapter3Title: string;
  guideChapter3Desc: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  gotItBtn: string;

  // Monetization & Footer
  adSlotTitle: string;
  adSlotDesc: string;
  adSlotEst: string;
  lineBotTitle: string;
  lineBotDesc: string;
  lineBotBtn: string;
  footerTitle: string;
  footerDisclaimer: string;
  footerZeroCustomers: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  TH: {
    sysActive: 'ระบบทำงานปกติ // เครือข่ายสถิติสด',
    engineName: 'QUANT-NEXUS CORE™ PROPRIETARY SYSTEM',
    guideButton: 'แนะนำวิธีใช้งาน',
    langSelect: 'เปลี่ยนภาษา',
    terminalTab: 'เทอร์มินัลวิเคราะห์',
    heatmapTab: 'ตารางสถิติ 00-99',
    warRoomTab: 'ห้องลุ้นสด LIVE',
    proofTab: 'บันทึกความแม่นยำ',
    countdownTitle: 'นับถอยหลังออกรางวัล',
    latestDrawTitle: 'ผลรางวัลงวดล่าสุด',
    topTwoDigit: '2 ตัวบน',
    bottomTwoDigit: '2 ตัวล่าง',
    algorithmIndex: 'ดัชนีเสถียรภาพตัวเลข',
    highAccuracy: 'ความแม่นยำระดับสถิติสูง',
    quantPool: 'หน่วยประมวลผลควอนต์',
    simulationsLabel: 'รอบจำลอง',
    backtestNote: 'ผ่านการทดสอบย้อนหลัง 300+ งวด',
    convergenceNote: 'เข้าสู่จุดสมดุลความเชื่อมั่น 95%',
    drawDatePrefix: 'งวดวันที่',

    mode2D: '2 ตัว (2D)',
    mode3D: '3 ตัว (3D)',
    frontThreeDigit: '3 ตัวหน้า',
    backThreeDigit: '3 ตัวท้าย',
    topThreeDigit: '3 ตัวบน',
    patternHaam: 'เลขหาม (สลับ)',
    patternDouble: 'เลขเบิ้ล (ซ้ำ)',
    patternClean: 'เลขไม่ซ้ำ',
    patternTriple: 'เลขตอง',
    patternDistTitle: 'โครงสร้างสถิติเลข 3 ตัว (3D PATTERN DISTRIBUTION)',
    patternDistDesc: 'วิเคราะห์โครงสร้าง: เลขไม่ซ้ำ 72% | เลขหาม 18% | เลขเบิ้ล 9.5% | เลขตอง 0.5%',
    sumRootLabel: 'ผลรวมราก (Sum Root)',
    payoutComparison: 'อัตราจ่าย 3 ตัว: 850x - 900x (เทียบกับ 2 ตัว: 90x - 95x)',
    liveClockLabel: 'เวลาเซิร์ฟเวอร์ระบบสด',
    drawTodayAlertTitle: '🚨 วันนี้วันหวยออก! สลากกินแบ่งรัฐบาลไทย (16 กันยายน 2569)',
    drawTodayAlertSub: 'ออกรางวัลวันนี้ เวลา 14:30 - 15:30 น. โมเดลคำนวณสถิติ 100,000 รอบล็อกเป้าหมายพร้อมแล้ว',
    drawTodayBadge: 'งวดวันนี้ 16 ก.ย. 69',
    drawLiveAlertTitle: '🔴 กำลังออกรางวัลสด! สลากกินแบ่งรัฐบาลไทย',
    drawLiveAlertSub: 'ระบบกำลังเปิดรับผลรางวัลสดพร้อมคำนวณอัตราความแม่นยำ (Verification Audit)',
    drawLiveBadge: 'LIVE NOW',
    drawTomorrowAlertTitle: '🚨 พรุ่งนี้วันหวยออก! สลากกินแบ่งรัฐบาลไทย (16 กันยายน 2569)',
    drawTomorrowAlertSub: 'ออกรางวัลพรุ่งนี้เวลา 14:30 - 15:30 น. โมเดลคำนวณสถิติ 100,000 รอบล็อกเป้าหมายพร้อมแล้ว',
    drawTomorrowBadge: 'งวดพรุ่งนี้ 16 ก.ย. 69',
    eventRadarTitle: 'เรดาร์ตารางออกรางวัล (UPCOMING LOTTERY RADAR)',
    eventRadarSub: 'ตารางการออกรางวัลเรียงตามเวลา สลับวิเคราะห์โมเดลล่วงหน้าได้ใน 1 คลิก',
    todayLabel: 'วันนี้',
    tomorrowLabel: 'พรุ่งนี้',
    analyzeMarketBtn: 'วิเคราะห์ตลาดนี้',
    superDrawDayBadge: 'SUPER DRAW DAY',
    majorEventBadge: 'รางวัลใหญ่ประจำงวด',
    
    markets: {
      THAI: {
        name: 'สลากกินแบ่งรัฐบาลไทย',
        schedule: 'ทุกวันที่ 1 และ 16 ของเดือน (14:30 - 15:30 น.)'
      },
      LAO: {
        name: 'หวยลาวพัฒนา (Lao Lotto)',
        schedule: 'ทุกวันจันทร์, พุธ, ศุกร์ (20:00 - 20:30 น.)'
      },
      HANOI: {
        name: 'หวยฮานอยปกติ (เวียดนาม)',
        schedule: 'ออกรางวัลทุกวัน (18:00 - 18:30 น.)'
      },
      HANOI_VIP: {
        name: 'หวยฮานอย VIP',
        schedule: 'ออกรางวัลทุกวัน (19:00 - 19:30 น.)'
      }
    },
    
    engine1Title: 'ระบบประมวลผลหลัก: QUANT-NEXUS PROBABILITY™',
    engine1Badge: 'ลิขสิทธิ์เฉพาะ 100K รอบ',
    engine1Desc: 'ระบบจำลองการกระจายตัวของตัวเลข 100,000 รอบ เพื่อหาจุดศูนย์กลางของเลขเด่นที่มีพลังทางสถิติสูงสุด',
    engine1Button: 'กดเพื่อรันประมวลผล 100,000 ครั้ง',
    engine1Computing: 'กำลังประมวลผลมวลตัวเลข...',
    engine1TopTitle: '5 อันดับตัวเลขพลังสถิติสูงสุด (QUANT ALPHA PICKS)',
    engine1ConfLevel: 'ระดับความเชื่อมั่น: สูงสุด (95% CI)',
    
    engine2Title: 'เรดาร์พลังดึงดูดต่อเนื่อง: MOMENTUM FLUX RADAR™',
    engine2Badge: 'ตรวจจับคลื่นตัวเลข',
    engine2Desc: 'วิเคราะห์การส่งต่อกำลังของหลักเลข จากงวดก่อนหน้าสู่งวดถัดไปในรอบสถิติระยะยาว',
    engine2Select: 'เลือกเลขหลักจากงวดที่แล้ว:',
    engine2Result: 'เลขที่มีคลื่นความถี่ดึงดูดสูงสุดในงวดถัดไป:',
    
    engine3Title: 'ระบบตรวจวัดสมดุลตัวเลข: EQUILIBRIUM SCANNER™',
    engine3Badge: 'ตรวจจับความผิดปกติ',
    engine3Desc: 'คัดกรองตัวเลขฟอร์มแรงกำลังเข้าฝัก (Hot) และตัวเลขที่ขาดช่วงนานจนมีแรงดึงดูดกลับสู่สมดุล (Cold)',
    hotTitle: 'เลขฟอร์มแรง (MOMENTUM HOT)',
    coldTitle: 'เลขรอรีบาวด์ (EQUILIBRIUM COLD)',
    hotSub: 'ออกซ้ำบ่อยในรอบสถิติล่าสุด',
    coldSub: 'ค้างงวดนาน มีพลังดึงดูดกลับมา',
    engine3Note: 'หลักการสมดุลสถิติ: ตัวเลขที่ขาดช่วงนานผิดปกติ มักจะมีพลังสถิติดึงกลับมาออกรางวัลในระยะสั้นถึงกลาง',
    
    heatmapTitle: 'ตารางความเข้มข้นตัวเลข 00-99 (PROBABILITY MATRIX)',
    heatmapDesc: 'แผนผังระดับความแรงของตัวเลข 00 ถึง 99 คลิกที่ตัวเลขเพื่อดูประวัติและระดับพลังงานทางสถิติ',
    legendHot: 'Hot (เลขฟอร์มแรง)',
    legendCold: 'Cold (เลขค้างนาน/รอรีบาวด์)',
    legendAboveAvg: 'พลังสถิติสูงกว่าเกณฑ์',
    legendBaseline: 'เกณฑ์ปกติ',
    dossierEnergyStatus: 'สถานะพลังงานสถิติ:',
    dossierDrawCount: 'สถิติการออก',
    dossierDrawsAbsent: 'ค้างงวดล่าสุด',
    dossierJustDrawn: 'เพิ่งออกในงวดล่าสุด!',
    dossierAbsenceLabel: 'จำนวนงวดที่ไม่ปรากฏ',
    dossierEvalTitle: 'การประเมินจากระบบ Quant-Nexus',
    dossierEvalHot: 'ตัวเลขนี้กำลังมีพลังโมเมนตัมต่อเนื่อง ออกซ้ำบ่อยครั้งในรอบสถิติล่าสุด',
    dossierEvalCold: 'ตัวเลขนี้ขาดช่วงนานเกิน 8 งวด มีแรงดึงดูดทางสถิติสูงให้กลับคืนสู่สมดุล',
    dossierEvalNeutral: 'ตัวเลขนี้มีการกระจายตัวอยู่ในเกณฑ์ค่าเฉลี่ยปกติ',
    dossierCloseBtn: 'ปิดหน้าต่างข้อมูล (CLOSE)',
    
    warRoomTitle: 'ห้องสังเกตการณ์สด WAR ROOM (จำลองการออกรางวัล)',
    warRoomDesc: 'ห้องลุ้นสดจำลองการหมุนวงล้อรางวัล ตัดความน่าจะเป็นแบบวินาทีต่อวินาทีเมื่อลูกบอลแต่ละหลักปรากฏ',
    warRoomButton: 'เริ่มจำลองการออกรางวัลสด',
    warRoomTens: 'หลักสิบ (TENS)',
    warRoomUnits: 'หลักหน่วย (UNITS)',
    warRoomLocked: 'ล็อกผล',
    warRoomWinner: 'ออกผล',
    warRoomAwaiting: 'รอเริ่มการออกรางวัล (100 หมายเลข)',
    warRoomShrunk: 'ล็อกหลักสิบแล้ว // ตัดเหลือ 10 หมายเลข',
    warRoomCompleted: 'ออกรางวัลเสร็จสิ้น // ผลลัพธ์คือ',
    warRoomInstruction: 'เพื่อจำลองการตัดความเป็นไปได้แบบสดๆ เมื่อลูกบอลแต่ละหลักปรากฏ',
    warRoomEliminatedNotice: 'ตัดเลขที่ไม่เกี่ยวข้องทิ้งทันที 90%! เหลือตัวเลขที่มีโอกาสเพียง 10 หมายเลข:',
    warRoomResultPrefix: 'ผลการออกรางวัล 2 ตัว:',
    warRoomVerifiedEngine: 'ระบบบันทึกผลเข้าระบบประมวลผล Quant-Nexus สำเร็จ',
    warRoomResetBtn: 'รีเซ็ต',
    
    proofTitle: 'PUBLIC PROOF-OF-ALGORITHM',
    proofBadge: 'SHA-256 COMMITMENT',
    proofDesc: 'สมุดประวัติความแม่นยำโปร่งใส ทุกงวดถูกบันทึก Hash เข้าระบบก่อนหวยออก 2 ชั่วโมง ไม่มีการสลับตัวเลขย้อนหลัง',
    proofHitRateLabel: 'อัตราความแม่นยำรวม (TOP-5)',
    proofVerifiedDrawsLabel: 'งวดที่ตรวจสอบแล้ว',
    proofDrawUnit: 'งวด',
    proofGuaranteeTitle: 'การันตีด้วยรหัสวิทยา (Cryptographic Guarantee):',
    proofGuaranteeText: 'ระบบจะทำการคำนวณและสร้าง Cryptographic Hash ยืนยันผลการทำนาย Top-5 ลงฐานข้อมูลสาธารณะก่อนเวลาเริ่มหมุนวงล้อรางวัลจริงเสมอ ใครก็สามารถนำ Hash ไปตรวจสอบย้อนหลังได้',
    proofTableTitle: 'บันทึกประวัติความแม่นยำโปร่งใส (HISTORICAL PROOF LEDGER)',
    proofAuditedBadge: 'สถานะ: ตรวจสอบและยืนยันแล้ว',
    proofThDateMarket: 'งวดวันที่ / ตลาดหวย',
    proofThPredictions: 'เลขเด่น TOP-5 ล่วงหน้า',
    proofThActual: 'ผลรางวัลจริง',
    proofThResult: 'ผลการจับคู่',
    proofThHash: 'รหัสแฮช SHA-256 ยืนยันเวลา',
    proofCopied: 'คัดลอกรหัสแฮชสำเร็จ!',

    guideTitle: 'คู่มือใช้งาน QUANTLOTTO สำหรับผู้เริ่มต้น',
    guideSub: 'ดูจบใน 1 นาที เข้าใจทันทีว่าต้องดูตรงไหนก่อนหวยออก!',
    guideChapter1Title: 'ขั้นตอนที่ 1: ส่องเลขเด่น 5 อันดับแรก (Alpha Picks)',
    guideChapter1Desc: 'เปิดหน้าแรกมา ให้ดูที่การ์ด RANK #1 ถึง #5 ทันที! สลับโหมด 2D/3D ได้ตามชอบ',
    guideChapter2Title: 'ขั้นตอนที่ 2: เช็กเลขในใจบนตาราง 00-99 (Heatmap)',
    guideChapter2Desc: 'ถ้ามีเลขที่ชอบอยู่แล้ว ให้กดแท็บ ตารางสถิติ 00-99 เพื่อเช็กว่าเลขของเรากำลังเป็น สีเขียว (Hot เลขฟอร์มแรง) หรือ สีฟ้า (Cold เลขค้างนาน)',
    guideChapter3Title: 'ขั้นตอนที่ 3: เข้าห้องลุ้นสดช่วงบ่าย (War Room)',
    guideChapter3Desc: 'ในวันออกรางวัล เข้าแท็บ ห้องลุ้นสด เมื่อลูกบอลหลักสิบหมุนออก ระบบจะตัดตัวเลขที่ไม่เกี่ยวข้องออกทันที 90% เหลือ 10 ตัวให้ลุ้นแบบเรียลไทม์!',
    step1Title: '1. ดูเลขเด่น 5 อันดับแรก (2D & 3D Picks)',
    step1Desc: 'กดสลับปุ่ม [2D] หรือ [3D] เพื่อดูเลขคัดเกรด 5 อันดับแรกที่มีโอกาสสูงสุด',
    step2Title: '2. เช็กเลขที่ชอบในตาราง 00-99 (Heatmap)',
    step2Desc: 'ตรวจว่าเลขที่เล็งไว้กำลังมีโมเมนตัม (Hot) หรือค้างนานรอรีบาวด์ (Cold)',
    step3Title: '3. เข้าห้องลุ้นสดช่วงบ่าย (War Room)',
    step3Desc: 'ในวันหวยออก เข้าแท็บ "ห้องลุ้นสด" รอลุ้นลูกบอลตัดเปอร์เซ็นต์แบบสดๆ',
    gotItBtn: 'เข้าใจแล้ว เริ่มใช้งานเลย!',

    adSlotTitle: 'พื้นที่สร้างกระแสเงินสด // SPONSOR & ADSENSE SLOT',
    adSlotDesc: 'พื้นที่สร้างรายได้อัตโนมัติ: ป้ายแบนเนอร์ตรง หรือ Google AdSense Financial Network (ไม่มีลูกค้าจุกจิก เงินโอนอัตโนมัติ)',
    adSlotEst: 'ประมาณการรายได้: 30K - 100K/เดือน',
    lineBotTitle: 'บอทแจ้งเตือนผลสด LINE OA',
    lineBotDesc: 'รับแจ้งเตือนผลสลากและเลขสถิติก่อนใคร',
    lineBotBtn: 'แอด LINE',
    footerTitle: 'QUANTLOTTO TERMINAL // QUANT-NEXUS LAB',
    footerDisclaimer: 'ระบบจัดทำขึ้นเพื่อการวิเคราะห์ทางสถิติและความน่าจะเป็นเชิงปริมาณ (Proprietary Statistical Engine) ไม่สนับสนุนการพนันที่ผิดกฎหมาย',
    footerZeroCustomers: 'ระบบอัตโนมัติ 100% // ZERO CUSTOMERS'
  },
  LA: {
    sysActive: 'ລະບົບປົກກະຕິ // ເຄືອຂ່າຍສະຖິຕິສົດ',
    engineName: 'QUANT-NEXUS CORE™ PROPRIETARY SYSTEM',
    guideButton: 'ວິທີນຳໃຊ້',
    langSelect: 'ປ່ຽນພາສາ',
    terminalTab: 'ລະບົບວິເຄາະ',
    heatmapTab: 'ຕາຕະລາງ 00-99',
    warRoomTab: 'ຫ້ອງລຸ້ນສົດ LIVE',
    proofTab: 'ປະຫວັດຄວາມແມ່ນຍຳ',
    countdownTitle: 'ນັບຖອຍຫຼັງອອກລາງວັນ',
    latestDrawTitle: 'ຜົນລາງວັນຫຼ້າສຸດ',
    topTwoDigit: '2 ໂຕເທິງ',
    bottomTwoDigit: '2 ໂຕລຸ່ມ',
    algorithmIndex: 'ດັດຊະນີຄວາມສະຖຽນ',
    highAccuracy: 'ຄວາມແມ່ນຍຳສູງ',
    quantPool: 'ໜ່ວຍປະມວນຜົນຄວອນຕ໌',
    simulationsLabel: 'ຮອບຈຳລອງ',
    backtestNote: 'ຜ່ານການທົດສອບຍ້ອນຫຼັງ 300+ ງວດ',
    convergenceNote: 'ເຂົ້າສູ່ຈຸດສົມດຸນຄວາມເຊື່ອໝັ້ນ 95%',
    drawDatePrefix: 'ງວດວັນທີ',

    mode2D: '2 ໂຕ (2D)',
    mode3D: '3 ໂຕ (3D)',
    frontThreeDigit: '3 ໂຕໜ້າ',
    backThreeDigit: '3 ໂຕທ້າຍ',
    topThreeDigit: '3 ໂຕເທິງ',
    patternHaam: 'ເລກຫາບ (Symmetrical)',
    patternDouble: 'ເລກເບິ້ນ (Double)',
    patternClean: 'ເລກບໍ່ຊ້ຳ',
    patternTriple: 'ເລກຕອງ',
    patternDistTitle: 'ໂຄງສ້າງສະຖິຕິເລກ 3 ໂຕ (3D PATTERN)',
    patternDistDesc: 'ສະຖິຕິຮູບແບບ: ເລກບໍ່ຊ້ຳ 72% | ເລກຫາບ 18% | ເລກເບິ້ນ 9.5% | ເລກຕອງ 0.5%',
    sumRootLabel: 'ຜົນລວມຮາກ (Sum Root)',
    payoutComparison: 'ອັດຕາຈ່າຍ 3 ໂຕ: 850x - 900x (ທຽບກັບ 2 ໂຕ: 90x - 95x)',
    liveClockLabel: 'ເວລາເຊີບເວີສົດ',
    drawTodayAlertTitle: '🚨 ມື້ນີ້ແມ່ນມື້ຫວຍອອກ! ສະຫລາກກິນແບ່ງລັດຖະບານໄທ (16 ກັນຍາ 2026)',
    drawTodayAlertSub: 'ອອກລາງວັນມື້ນີ້ເວລາ 14:30 - 15:30. ໂມເດວຄຳນວນສະຖິຕິ 100,000 ຮອບພ້ອມແລ້ວ',
    drawTodayBadge: 'ງວດມື້ນີ້ 16 ກ.ຍ.',
    drawLiveAlertTitle: '🔴 ກຳລັງອອກລາງວັນສົດ! ສະຫລາກກິນແບ່ງລັດຖະບານໄທ',
    drawLiveAlertSub: 'ລະບົບກຳລັງເປີດຮັບຜົນລາງວັນສົດພ້ອມຄຳນວນຄວາມຖືກຕ້ອງ',
    drawLiveBadge: 'LIVE NOW',
    drawTomorrowAlertTitle: '🚨 ມື້ອື່ນແມ່ນມື້ຫວຍອອກ! ສະຫລາກກິນແບ່ງລັດຖະບານໄທ (16 ກັນຍາ 2026)',
    drawTomorrowAlertSub: 'ອອກລາງວັນມື້ອື່ນເວລາ 14:30 - 15:30. ໂມເດວຄຳນວນສະຖິຕິ 100,000 ຮອບພ້ອມແລ້ວ',
    drawTomorrowBadge: 'ງວດມື້ອື່ນ 16 ກ.ຍ.',
    eventRadarTitle: 'ຕາຕະລາງອອກລາງວັນ (UPCOMING LOTTERY RADAR)',
    eventRadarSub: 'ຕາຕະລາງການອອກລາງວັນຕາມເວລາ, ສັບປ່ຽນວິເຄາະໂມເດວໄດ້ໃນ 1 ຄລິກ',
    todayLabel: 'ມື້ນີ້',
    tomorrowLabel: 'ມື້ອື່ນ',
    analyzeMarketBtn: 'ວິເຄາະຕະຫຼາດນີ້',
    superDrawDayBadge: 'SUPER DRAW DAY',
    majorEventBadge: 'ລາງວັນໃຫຍ່ປະຈຳງວດ',
    
    markets: {
      THAI: {
        name: 'ສະຫລາກກິນແບ່ງລັດຖະບານໄທ',
        schedule: 'ທຸກວັນທີ 1 ແລະ 16 ຂອງເດືອນ (14:30 - 15:30)'
      },
      LAO: {
        name: 'ຫວຍພັດທະນາລາວ (Lao Lotto)',
        schedule: 'ທຸກວັນຈັນ, ພຸດ, ສຸກ (20:00 - 20:30)'
      },
      HANOI: {
        name: 'ຫວຍຮານອຍປົກກະຕິ (ຫວຽດນາມ)',
        schedule: 'ອອກລາງວັນທຸກມື້ (18:00 - 18:30)'
      },
      HANOI_VIP: {
        name: 'ຫວຍຮານອຍ VIP',
        schedule: 'ອອກລາງວັນທຸກມື້ (19:00 - 19:30)'
      }
    },
    
    engine1Title: 'ລະບົບຫຼັກ: QUANT-NEXUS PROBABILITY™',
    engine1Badge: 'ລິຂະສິດສະເພາະ 100K ຮອບ',
    engine1Desc: 'ຈຳລອງການກະຈາຍຕົວຂອງຕົວເລກ 100,000 ຮອບ ເພື່ອຊອກຫາຕົວເລກເດັ່ນທີ່ມີພະລັງສະຖິຕິສູງສຸດ',
    engine1Button: 'ກົດເພື່ອຄິດໄລ່ 100,000 ຄັ້ງ',
    engine1Computing: 'ກຳລັງປະມວນຜົນຕົວເລກ...',
    engine1TopTitle: '5 ອັນດັບເລກພະລັງສູງສຸດ (QUANT ALPHA PICKS)',
    engine1ConfLevel: 'ລະດັບຄວາມເຊື່ອໝັ້ນ: 95% CI',
    
    engine2Title: 'ເຣດາພະລັງດຶງດູດ: MOMENTUM FLUX RADAR™',
    engine2Badge: 'ກວດຈັບຄື້ນຕົວເລກ',
    engine2Desc: 'ວິເຄາະກຳລັງການປ່ຽນຜ່ານຂອງຕົວເລກຈາກງວດກ່ອນໜ້າສູ່ງວດຖັດໄປ',
    engine2Select: 'ເລືອກເລກງວດກ່ອນໜ້າ:',
    engine2Result: 'ເລກທີ່ມີພະລັງດຶງດູດສູງສຸດໃນງວດຖັດໄປ:',
    
    engine3Title: 'ລະບົບກວດວັດຄວາມສົມດຸນ: EQUILIBRIUM SCANNER™',
    engine3Badge: 'ກວດຈັບເລກຜິດປົກກະຕິ',
    engine3Desc: 'ຄັດເລກກຳລັງມາແຮງ (Hot) ແລະ ເລກທີ່ຄ້າງດົນມີແຮງດຶງດູດກັບ (Cold)',
    hotTitle: 'ເລກກຳລັງແຮງ (MOMENTUM HOT)',
    coldTitle: 'ເລກລໍຖ້າຣີບາວ (EQUILIBRIUM COLD)',
    hotSub: 'ອອກຊ້ຳເລື້ອຍໆໃນໄລຍະນີ້',
    coldSub: 'ຄ້າງດົນ ມີແຮງດຶງດູດກັບມາ',
    engine3Note: 'ຫຼັກການສົມດຸນ: ຕົວເລກທີ່ຄ້າງດົນຜິດປົກກະຕິ ມັກຈະມີພະລັງດຶງກັບມາອອກໃນໄລຍະສັ້ນ',
    
    heatmapTitle: 'ຕາຕະລາງຄວາມເຂັ້ມຕົວເລກ 00-99 (PROBABILITY MATRIX)',
    heatmapDesc: 'ແຜນຜັງຕົວເລກ 00 ຫາ 99 ກົດທີ່ຕົວເລກເພື່ອເບິ່ງປະຫວັດສະຖິຕິ',
    legendHot: 'Hot (ເລກກຳລັງມາແຮງ)',
    legendCold: 'Cold (ເລກຄ້າງດົນ/ລໍຣີບາວ)',
    legendAboveAvg: 'ພະລັງສະຖິຕິສູງ',
    legendBaseline: 'ເກນປົກກະຕິ',
    dossierEnergyStatus: 'ສະຖານະພະລັງງານສະຖິຕິ:',
    dossierDrawCount: 'ສະຖິຕິການອອກ',
    dossierDrawsAbsent: 'ຄ້າງງວດຫຼ້າສຸດ',
    dossierJustDrawn: 'ຫາອອກໃນງວດຫຼ້າສຸດ!',
    dossierAbsenceLabel: 'ຈຳນວນງວດທີ່ບໍ່ອອກ',
    dossierEvalTitle: 'ການປະເມີນຈາກລະບົບ Quant-Nexus',
    dossierEvalHot: 'ຕົວເລກນີ້ກຳລັງມີພະລັງໂມເມນຕຳ ອອກຊ້ຳເລື້ອຍໆໃນໄລຍະນີ້',
    dossierEvalCold: 'ຕົວເລກນີ້ຄ້າງດົນເກີນ 8 ງວດ ມີແຮງດຶງດູດສູງກັບຄືນສູ່ສົມດຸນ',
    dossierEvalNeutral: 'ຕົວເລກນີ້ກະຈາຍຕົວໃນເກນປົກກະຕິ',
    dossierCloseBtn: 'ປິດໜ້າຕ່າງ (CLOSE)',
    
    warRoomTitle: 'ຫ້ອງສັງເກດການສົດ WAR ROOM (ຈຳລອງການອອກລາງວັນ)',
    warRoomDesc: 'ຫ້ອງລຸ້ນສົດຈຳລອງການໝຸນວົງລໍ້ ຕັດຄວາມເປັນໄປໄດ້ແບບວິຕໍ່ວິ',
    warRoomButton: 'ເລີ່ມຈຳລອງການອອກລາງວັນ',
    warRoomTens: 'ຫຼັກສິບ (TENS)',
    warRoomUnits: 'ຫຼັກໜ່ວຍ (UNITS)',
    warRoomLocked: 'ລັອກຜົນ',
    warRoomWinner: 'ອອກຜົນ',
    warRoomAwaiting: 'ລໍຖ້າເລີ່ມອອກລາງວັນ (100 ໝາຍເລກ)',
    warRoomShrunk: 'ລັອກຫຼັກສິບແລ້ວ // ຕັດເຫຼືອ 10 ໝາຍເລກ',
    warRoomCompleted: 'ອອກລາງວັນສຳເລັດ // ຜົນອອກມາແມ່ນ',
    warRoomInstruction: 'ເພື່ອຈຳລອງການຕັດຄວາມເປັນໄປໄດ້ແບບສົດໆ ເມື່ອລູກບານແຕ່ລະຫຼັກປາກົດ',
    warRoomEliminatedNotice: 'ຕັດເລກທີ່ບໍ່ກ່ຽວຂ້ອງອອກ 90%! ເຫຼືອພຽງ 10 ຕົວເລກທີ່ມີໂອກາດ:',
    warRoomResultPrefix: 'ຜົນການອອກລາງວັນ 2 ໂຕ:',
    warRoomVerifiedEngine: 'ລະບົບບັນທຶກຜົນເຂົ້າຖານຂໍ້ມູນ Quant-Nexus ສຳເລັດ',
    warRoomResetBtn: 'ຣີເຊັດ',
    
    proofTitle: 'PUBLIC PROOF-OF-ALGORITHM',
    proofBadge: 'SHA-256 COMMITMENT',
    proofDesc: 'ປະຫວັດຄວາມແມ່ນຍຳໂປ່ງໃສ ບັນທຶກ Hash ເຂົ້າລະບົບກ່ອນຫວຍອອກ 2 ຊົ່ວໂມງ',
    proofHitRateLabel: 'ອັດຕາຄວາມແມ່ນຍຳລວມ (TOP-5)',
    proofVerifiedDrawsLabel: 'ງວດທີ່ກວດສອບແລ້ວ',
    proofDrawUnit: 'ງວດ',
    proofGuaranteeTitle: 'ການຮັບປະກັນດ້ວຍລະຫັດລັບ (Cryptographic Guarantee):',
    proofGuaranteeText: 'ລະບົບຈະຄິດໄລ່ ແລະ ສ້າງ Cryptographic Hash ຢືນຢັນຜົນ Top-5 ລົງຖານຂໍ້ມູນກ່ອນອອກລາງວັນສະເໝີ',
    proofTableTitle: 'ຕາຕະລາງປະຫວັດຄວາມແມ່ນຍຳ (HISTORICAL PROOF LEDGER)',
    proofAuditedBadge: 'ສະຖານະ: ກວດສອບແລ້ວ',
    proofThDateMarket: 'ງວດວັນທີ / ຕະຫຼາດຫວຍ',
    proofThPredictions: 'ເລກເດັ່ນ TOP-5 ລ່ວງໜ້າ',
    proofThActual: 'ຜົນອອກຈິງ',
    proofThResult: 'ຜົນການຈັບຄູ່',
    proofThHash: 'ລະຫັດແຮຊ SHA-256 ຢືນຢັນເວລາ',
    proofCopied: 'ຄັດລອກລະຫັດແຮຊແລ້ວ!',

    guideTitle: 'ຄູ່ມືນຳໃຊ້ QUANTLOTTO ສຳລັບຜູ້ເລີ່ມຕົ້ນ',
    guideSub: 'ເບິ່ງຈົບໃນ 1 ນາທີ ເຂົ້າໃຈທັນທີວ່າຄວນເບິ່ງຈຸດໃດກ່ອນຫວຍອອກ!',
    guideChapter1Title: 'ຂັ້ນຕອນທີ 1: ເບິ່ງເລກເດັ່ນ 5 ອັນດັບແຮກ (Alpha Picks)',
    guideChapter1Desc: 'ເປີດໜ້າຫຼັກມາ ໃຫ້ເບິ່ງການ໌ດ RANK #1 ຫາ #5 ທັນທີ! ສະຫຼັບໂໝດ 2D/3D ໄດ້ຕາມສະດວກ',
    guideChapter2Title: 'ຂັ້ນຕອນທີ 2: ກວດເລກທີ່ມັກໃນຕາຕະລາງ 00-99 (Heatmap)',
    guideChapter2Desc: 'ຖ້າມີເລກໃນໃຈ ໃຫ້ກົດແທັບ ຕາຕະລາງ 00-99 ເພື່ອກວດວ່າເລກເປັນສີຂຽວ (Hot) ຫຼື ສີຟ້າ (Cold)',
    guideChapter3Title: 'ຂັ້ນຕອນທີ 3: ເຂົ້າຫ້ອງລຸ້ນສົດ (War Room)',
    guideChapter3Desc: 'ໃນມື້ຫວຍອອກ ເຂົ້າແທັບ ຫ້ອງລຸ້ນສົດ ລະບົບຈະຕັດເລກທີ່ບໍ່ກ່ຽວຂ້ອງອອກທັນທີ 90% ແບບສົດໆ!',
    step1Title: '1. ເບິ່ງເລກເດັ່ນ 5 ອັນດັບແຮກ (2D & 3D Picks)',
    step1Desc: 'ກົດສະຫຼັບປຸ່ມ [2D] ຫຼື [3D] ເພື່ອເບິ່ງເລກເດັ່ນ',
    step2Title: '2. ກວດເລກທີ່ມັກໃນຕາຕະລາງ 00-99',
    step2Desc: 'ກວດວ່າເລກທີ່ມັກກຳລັງມາແຮງ ຫຼື ຄ້າງດົນ',
    step3Title: '3. ເຂົ້າຫ້ອງລຸ້ນສົດ (War Room)',
    step3Desc: 'ໃນມື້ຫວຍອອກ ເຂົ້າຫ້ອງລຸ້ນສົດ ລຸ້ນລູກບານຕັດເປີເຊັນແບບສົດໆ',
    gotItBtn: 'ເຂົ້າໃຈແລ້ວ ເລີ່ມນຳໃຊ້!',

    adSlotTitle: 'ພື້ນທີ່ສ້າງກະແສເງິນສົດ // SPONSOR & ADSENSE SLOT',
    adSlotDesc: 'ພື້ນທີ່ສ້າງລາຍໄດ້ອັດຕະໂນມັດ: ປ້າຍແບນເນີ ຫຼື Google AdSense (ບໍ່ມີລູກຄ້າຈຸກຈິກ)',
    adSlotEst: 'ປະມານການລາຍຮັບ: 30K - 100K/ເດືອນ',
    lineBotTitle: 'ບັອດແຈ້ງເຕືອນຜົນສົດ LINE OA',
    lineBotDesc: 'ຮັບແຈ້ງເຕືອນຜົນຫວຍ ແລະ ເລກສະຖິຕິກ່ອນໃຜ',
    lineBotBtn: 'ແອດ LINE',
    footerTitle: 'QUANTLOTTO TERMINAL // QUANT-NEXUS LAB',
    footerDisclaimer: 'ລະບົບຈັດທຳຂຶ້ນເພື່ອການວິເຄາະທາງສະຖິຕິເທົ່ານັ້ນ ບໍ່ສະໜັບສະໜູນການພະນັນຜິດກົດໝາຍ',
    footerZeroCustomers: 'ລະບົບອັດຕະໂນມັດ 100% // ZERO CUSTOMERS'
  },
  VN: {
    sysActive: 'HỆ THỐNG HOẠT ĐỘNG // DỮ LIỆU THỐNG KÊ TRỰC TIẾP',
    engineName: 'QUANT-NEXUS CORE™ PROPRIETARY SYSTEM',
    guideButton: 'HƯỚNG DẪN',
    langSelect: 'Ngôn ngữ',
    terminalTab: 'Phân Tích',
    heatmapTab: 'Ma Trận 00-99',
    warRoomTab: 'Phòng Trực Tiếp',
    proofTab: 'Minh Chứng Độ Chuẩn',
    countdownTitle: 'ĐẾM NGƯỢC GIỜ QUAY',
    latestDrawTitle: 'Kết Quả Kỳ Trước',
    topTwoDigit: '2 Số Đầu',
    bottomTwoDigit: '2 Số Đuôi',
    algorithmIndex: 'Chỉ Số Ổn Định',
    highAccuracy: 'Độ Chuẩn Xác Cao',
    quantPool: 'Bộ Xử Lý Lượng Tử',
    simulationsLabel: 'Vòng Giả Lập',
    backtestNote: 'Đã kiểm thử ngược 300+ kỳ',
    convergenceNote: 'Đạt hội tụ độ tin cậy 95%',
    drawDatePrefix: 'Kỳ quay ngày',

    mode2D: '2 Số (2D)',
    mode3D: '3 Càng (3D)',
    frontThreeDigit: '3 Số Đầu',
    backThreeDigit: '3 Số Đuôi',
    topThreeDigit: '3 Càng (3 Số Cuối)',
    patternHaam: 'Số Gánh (Đảo)',
    patternDouble: 'Số Kép',
    patternClean: 'Số Đơn',
    patternTriple: 'Tam Hoa',
    patternDistTitle: 'CƠ CẤU MÔ HÌNH 3 CÀNG (3D PATTERN)',
    patternDistDesc: 'Cơ cấu xác suất: Số Đơn 72% | Số Gánh 18% | Số Kép 9.5% | Tam Hoa 0.5%',
    sumRootLabel: 'Tổng Căn (Sum Root)',
    payoutComparison: 'Tỷ lệ trả thưởng 3 Càng: 850x - 900x (so với 2 Số: 90x - 95x)',
    liveClockLabel: 'Giờ Hệ Thống Trực Tiếp',
    drawTodayAlertTitle: '🚨 HÔM NAY LÀ NGÀY QUAY THƯỞNG! Xổ Số Thái Lan (16/09/2026)',
    drawTodayAlertSub: 'Quay thưởng hôm nay lúc 14:30 - 15:30. Mô hình giả lập lượng tử 100.000 vòng đã khóa mục tiêu',
    drawTodayBadge: 'Kỳ quay hôm nay 16/09',
    drawLiveAlertTitle: '🔴 ĐANG QUAY THƯỞNG TRỰC TIẾP! Xổ Số Thái Lan',
    drawLiveAlertSub: 'Hệ thống đang theo dõi kết quả trực tiếp và xác thực thuật toán',
    drawLiveBadge: 'LIVE NOW',
    drawTomorrowAlertTitle: '🚨 NGÀY MAI LÀ NGÀY QUAY THƯỞNG! Xổ Số Thái Lan (16/09/2026)',
    drawTomorrowAlertSub: 'Quay thưởng ngày mai lúc 14:30 - 15:30. Mô hình giả lập lượng tử 100.000 vòng đã khóa mục tiêu',
    drawTomorrowBadge: 'Kỳ quay ngày mai 16/09',
    eventRadarTitle: 'LỊCH QUAY THƯỞNG (UPCOMING LOTTERY RADAR)',
    eventRadarSub: 'Lịch quay thưởng theo thời gian thực, chuyển đổi phân tích mô hình trong 1 cú nhấp chuột',
    todayLabel: 'Hôm nay',
    tomorrowLabel: 'Ngày mai',
    analyzeMarketBtn: 'Phân Tích Đài Này',
    superDrawDayBadge: 'SUPER DRAW DAY',
    majorEventBadge: 'Kỳ Quay Lớn',
    
    markets: {
      THAI: {
        name: 'Xổ Số Kiến Thiết Thái Lan (Thai Lotto)',
        schedule: 'Ngày 1 và 16 hàng tháng (14:30 - 15:30)'
      },
      LAO: {
        name: 'Xổ Số Lào Phát Triển (Lao Lotto)',
        schedule: 'Thứ 2, Thứ 4, Thứ 6 hàng tuần (20:00 - 20:30)'
      },
      HANOI: {
        name: 'Xổ Số Hà Nội Truyền Thống',
        schedule: 'Quay thưởng hàng ngày (18:00 - 18:30)'
      },
      HANOI_VIP: {
        name: 'Xổ Số Hà Nội VIP',
        schedule: 'Quay thưởng hàng ngày (19:00 - 19:30)'
      }
    },
    
    engine1Title: 'HỆ THỐNG CỐT LÕI: QUANT-NEXUS PROBABILITY™',
    engine1Badge: 'ĐỘC QUYỀN 100K VÒNG',
    engine1Desc: 'Mô phỏng phân phối số 100,000 lần để xác định đỉnh xác suất cao nhất của các con số may mắn',
    engine1Button: 'CHẠY GIẢ LẬP 100,000 LẦN',
    engine1Computing: 'Đang tính toán lượng tử...',
    engine1TopTitle: 'TOP 5 CON SỐ XÁC SUẤT CAO NHẤT (QUANT ALPHA)',
    engine1ConfLevel: 'Độ tin cậy: 95% CI',
    
    engine2Title: 'RADAR XUNG LỰC TIẾP DIỄN: MOMENTUM FLUX™',
    engine2Badge: 'BẮT SÓNG CHU KỲ',
    engine2Desc: 'Phân tích sự dịch chuyển chu kỳ giữa các con số từ kỳ trước sang kỳ sau',
    engine2Select: 'Chọn con số kỳ trước:',
    engine2Result: 'Các con số có xung lực hút mạnh nhất kỳ tới:',
    
    engine3Title: 'HỆ THỐNG CÂN BẰNG TẬP TRUNG: EQUILIBRIUM™',
    engine3Badge: 'QUÉT LỆCH CHUẨN',
    engine3Desc: 'Lọc các số đang vào cầu (Hot) và số khan lâu ngày có lực kéo hồi phục (Cold)',
    hotTitle: 'SỐ ĐANG VÀO CẦU (HOT)',
    coldTitle: 'SỐ KHAN CẦN HỒI (COLD)',
    hotSub: 'Xuất hiện liên tục gần đây',
    coldSub: 'Lâu chưa về, lực kéo lớn',
    engine3Note: 'Quy luật cân bằng: Những con số khan vượt ngưỡng thường có lực kéo quay trở lại rất mạnh',
    
    heatmapTitle: 'BẢN ĐỒ NHIỆT XÁC SUẤT 00-99 (HEATMAP)',
    heatmapDesc: 'Ma trận mật độ xác suất 00 đến 99, bấm vào từng số để xem phân tích chuyên sâu',
    legendHot: 'Hot (Số đang vào cầu)',
    legendCold: 'Cold (Số khan cần hồi)',
    legendAboveAvg: 'Năng lượng trên chuẩn',
    legendBaseline: 'Mức cơ bản',
    dossierEnergyStatus: 'Trạng thái năng lượng:',
    dossierDrawCount: 'Số lần đã về',
    dossierDrawsAbsent: 'Số kỳ chưa về (Khan)',
    dossierJustDrawn: 'Vừa về kỳ gần nhất!',
    dossierAbsenceLabel: 'Số kỳ vắng bóng',
    dossierEvalTitle: 'Đánh giá từ thuật toán Quant-Nexus',
    dossierEvalHot: 'Con số này đang có xung lực chu kỳ rất mạnh, liên tục xuất hiện gần đây',
    dossierEvalCold: 'Con số này đã vắng bóng trên 8 kỳ, có lực kéo quy hồi cực lớn',
    dossierEvalNeutral: 'Con số này nằm trong ngưỡng phân bổ bình thường',
    dossierCloseBtn: 'ĐÓNG BẢNG THÔNG TIN',
    
    warRoomTitle: 'PHÒNG TRỰC TIẾP QUAY SỐ (WAR ROOM)',
    warRoomDesc: 'Giả lập quay lồng cầu trực tiếp, loại bỏ 90% số rác ngay khi bóng số đầu tiên rơi',
    warRoomButton: 'BẮT ĐẦU GIẢ LẬP QUAY SỐ',
    warRoomTens: 'HÀNG CHỤC (TENS)',
    warRoomUnits: 'HÀNG ĐƠN VỊ (UNITS)',
    warRoomLocked: 'ĐÃ KHÓA',
    warRoomWinner: 'TRÚNG THƯỞNG',
    warRoomAwaiting: 'Đang chờ quay số (100 cặp số)',
    warRoomShrunk: 'Đã khóa hàng chục // Thu hẹp còn 10 cặp số',
    warRoomCompleted: 'Quay thưởng hoàn tất // Kết quả là',
    warRoomInstruction: 'để giả lập loại trừ xác suất theo thời gian thực khi từng bóng số xuất hiện',
    warRoomEliminatedNotice: 'Đã loại bỏ 90% số rác! Chỉ còn 10 cặp số tiềm năng nhất:',
    warRoomResultPrefix: 'Kết quả giải 2 số:',
    warRoomVerifiedEngine: 'Hệ thống đã lưu và đối chiếu dữ liệu Quant-Nexus thành công',
    warRoomResetBtn: 'LÀM LẠI',
    
    proofTitle: 'PUBLIC PROOF-OF-ALGORITHM',
    proofBadge: 'SHA-256 COMMITMENT',
    proofDesc: 'Sổ cái minh chứng độ chuẩn xác, mã băm Hash được ghi trước giờ quay 2 tiếng',
    proofHitRateLabel: 'TỶ LỆ TRÚNG TỔNG HỢP (TOP-5)',
    proofVerifiedDrawsLabel: 'SỐ KỲ ĐÃ KIỂM ĐỊNH',
    proofDrawUnit: 'kỳ',
    proofGuaranteeTitle: 'Bảo chứng mật mã học (Cryptographic Guarantee):',
    proofGuaranteeText: 'Hệ thống luôn tự động tạo mã băm SHA-256 xác thực dự đoán Top-5 trước khi lồng cầu quay',
    proofTableTitle: 'SỔ CÁI MINH CHỨNG LỊCH SỬ (HISTORICAL PROOF LEDGER)',
    proofAuditedBadge: 'TRẠNG THÁI: ĐÃ KIỂM ĐỊNH',
    proofThDateMarket: 'Kỳ quay / Đài mở thưởng',
    proofThPredictions: 'Dự đoán TOP-5 sớm',
    proofThActual: 'Kết quả thực tế',
    proofThResult: 'Khớp kết quả',
    proofThHash: 'Mã băm SHA-256 đối soát',
    proofCopied: 'Đã sao chép mã băm thành công!',

    guideTitle: 'HƯỚNG DẪN DÀNH CHO NGƯỜI MỚI',
    guideSub: 'Xem trong 1 phút để hiểu cách soi cầu xác suất cao nhất trước giờ quay!',
    guideChapter1Title: 'Bước 1: Xem Top 5 con số may mắn (Alpha Picks)',
    guideChapter1Desc: 'Tại giao diện chính, xem thẻ RANK #1 - #5 đã được giả lập lượng tử 100,000 lần (chuyển đổi 2D/3D tùy chọn)',
    guideChapter2Title: 'Bước 2: Tra cứu con số yêu thích trên Ma trận 00-99 (Heatmap)',
    guideChapter2Desc: 'Kiểm tra xem con số bạn thích đang là số Hot (vào cầu mạnh) hay Cold (khan lâu ngày cần hồi)',
    guideChapter3Title: 'Bước 3: Vào phòng quay trực tiếp trước giờ mở thưởng (War Room)',
    guideChapter3Desc: 'Theo dõi hệ thống tự động thu hẹp xác suất về 10 con số trực tiếp khi bóng số 1 xuất hiện!',
    step1Title: '1. Xem Top 5 con số may mắn (2D & 3D Picks)',
    step1Desc: 'Bấm chuyển đổi [2D] hoặc [3D] để xem cầu số ưng ý nhất',
    step2Title: '2. Tra cứu con số yêu thích trên Ma trận 00-99',
    step2Desc: 'Kiểm tra xem số của bạn là số Hot hay số Cold cần hồi',
    step3Title: '3. Vào phòng quay trực tiếp trước giờ mở thưởng',
    step3Desc: 'Theo dõi hệ thống tự động loại trừ xác suất theo thời gian thực',
    gotItBtn: 'ĐÃ HIỂU, VÀO TERMINAL NGAY',

    adSlotTitle: 'VỊ TRÍ TẠO DOANH THU // SPONSOR & ADSENSE',
    adSlotDesc: 'Khu vực tạo dòng tiền tự động: Banner tài trợ hoặc mạng lưới Google AdSense (Không cần chăm sóc khách hàng)',
    adSlotEst: 'Ước tính doanh thu: 30K - 100K/tháng',
    lineBotTitle: 'BOT THÔNG BÁO KẾT QUẢ LINE OA',
    lineBotDesc: 'Nhận thông báo kết quả và thống kê số sớm nhất',
    lineBotBtn: 'THÊM LINE',
    footerTitle: 'QUANTLOTTO TERMINAL // QUANT-NEXUS LAB',
    footerDisclaimer: 'Hệ thống phục vụ nghiên cứu thống kê xác suất định lượng, không cổ xúy cờ bạc bất hợp pháp',
    footerZeroCustomers: 'TỰ ĐỘNG HÓA 100% // ZERO CUSTOMERS'
  },
  EN: {
    sysActive: 'SYSTEM OPERATIONAL // LIVE STATS NETWORK',
    engineName: 'QUANT-NEXUS CORE™ PROPRIETARY SYSTEM',
    guideButton: 'USER GUIDE',
    langSelect: 'Language',
    terminalTab: 'TERMINAL',
    heatmapTab: 'HEATMAP 00-99',
    warRoomTab: 'LIVE WAR ROOM',
    proofTab: 'ACCURACY LEDGER',
    countdownTitle: 'COUNTDOWN TO DRAW',
    latestDrawTitle: 'LATEST OFFICIAL DRAW',
    topTwoDigit: 'Top 2D',
    bottomTwoDigit: 'Bottom 2D',
    algorithmIndex: 'Stability Index',
    highAccuracy: 'High Statistical Precision',
    quantPool: 'Quant Compute Pool',
    simulationsLabel: 'Simulations',
    backtestNote: 'Backtested over 300+ draws',
    convergenceNote: 'Convergence reached at 95% CI',
    drawDatePrefix: 'Draw Date:',

    mode2D: '2D Mode',
    mode3D: '3D Mode',
    frontThreeDigit: 'Front 3D',
    backThreeDigit: 'Back 3D',
    topThreeDigit: 'Top 3D',
    patternHaam: 'Symmetrical (Haam)',
    patternDouble: 'Double Pair',
    patternClean: 'Clean / Unique',
    patternTriple: 'Triple Pattern',
    patternDistTitle: '3D PATTERN DISTRIBUTION DYNAMICS',
    patternDistDesc: 'Structural Odds: Unique 72% | Symmetrical (Haam) 18% | Double 9.5% | Triple 0.5%',
    sumRootLabel: 'Digital Root (Sum Root)',
    payoutComparison: '3D Payout Multiplier: 850x - 900x (vs 2D: 90x - 95x)',
    liveClockLabel: 'Live System Clock',
    drawTodayAlertTitle: '🚨 TODAY IS OFFICIAL DRAW DAY! Thai Lottery (16 September 2026)',
    drawTodayAlertSub: 'Official draw broadcast today at 14:30 - 15:30 UTC+7. 100,000 Monte Carlo simulations locked.',
    drawTodayBadge: 'TODAY 16 SEP',
    drawLiveAlertTitle: '🔴 LIVE BROADCAST IN PROGRESS! Thai Lottery',
    drawLiveAlertSub: 'Live draw streaming. Real-time verification and algorithmic hit-rate auditing active.',
    drawLiveBadge: 'LIVE NOW',
    drawTomorrowAlertTitle: '🚨 TOMORROW IS OFFICIAL DRAW DAY! Thai Lottery (16 September 2026)',
    drawTomorrowAlertSub: 'Official draw broadcast tomorrow at 14:30 - 15:30 UTC+7. 100,000 Monte Carlo simulations locked.',
    drawTomorrowBadge: 'TOMORROW 16 SEP',
    eventRadarTitle: 'UPCOMING LOTTERY RADAR & SCHEDULE',
    eventRadarSub: 'Real-time multi-market timeline. One-click switch to analyze quantitative models for any upcoming draw.',
    todayLabel: 'Today',
    tomorrowLabel: 'Tomorrow',
    analyzeMarketBtn: 'Analyze Market',
    superDrawDayBadge: 'SUPER DRAW DAY',
    majorEventBadge: 'Major GLO Draw',
    
    markets: {
      THAI: {
        name: 'Thai Government Lottery',
        schedule: '1st & 16th of each month (14:30 - 15:30 UTC+7)'
      },
      LAO: {
        name: 'Lao Development Lottery',
        schedule: 'Every Mon, Wed, Fri (20:00 - 20:30 UTC+7)'
      },
      HANOI: {
        name: 'Hanoi Regular Lottery',
        schedule: 'Draws Daily (18:00 - 18:30 UTC+7)'
      },
      HANOI_VIP: {
        name: 'Hanoi VIP Lottery',
        schedule: 'Draws Daily (19:00 - 19:30 UTC+7)'
      }
    },
    
    engine1Title: 'CORE ENGINE: QUANT-NEXUS PROBABILITY™',
    engine1Badge: 'PROPRIETARY 100K RUNS',
    engine1Desc: 'Proprietary 100,000-run simulation model identifying peak statistical convergence zones',
    engine1Button: 'RUN 100,000 SIMULATIONS',
    engine1Computing: 'COMPUTING QUANTUM SAMPLES...',
    engine1TopTitle: 'TOP 5 QUANT-RANKED CANDIDATES (ALPHA PICKS)',
    engine1ConfLevel: 'Confidence Level: 95% CI',
    
    engine2Title: 'TRANSITION FLUX RADAR: MOMENTUM FLUX™',
    engine2Badge: 'DIGIT WAVE DETECTOR',
    engine2Desc: 'Measures sequential momentum transfer between consecutive historical draws',
    engine2Select: 'Select Previous Draw Digit:',
    engine2Result: 'Next Digits with Highest Attraction Flux:',
    
    engine3Title: 'ANOMALY BALANCING ENGINE: EQUILIBRIUM™',
    engine3Badge: 'ANOMALY DETECTOR',
    engine3Desc: 'Filters momentum leaders (Hot) and prolonged absence candidates facing mean-reversion pull (Cold)',
    hotTitle: 'MOMENTUM NUMBERS (HOT)',
    coldTitle: 'EQUILIBRIUM REBOUND (COLD)',
    hotSub: 'High recurrence momentum',
    coldSub: 'Prolonged absence, high rebound pull',
    engine3Note: 'Statistical Equilibrium Principle: Extreme absence creates measurable reversion pull toward historical baseline',
    
    heatmapTitle: 'PROBABILITY DENSITY MATRIX 00-99 (HEATMAP)',
    heatmapDesc: 'Interactive 10x10 density matrix. Click any number to inspect historical dossier',
    legendHot: 'Hot (Momentum Numbers)',
    legendCold: 'Cold (Absence / Rebound)',
    legendAboveAvg: 'Above Average Weight',
    legendBaseline: 'Baseline Distribution',
    dossierEnergyStatus: 'Statistical Energy Status:',
    dossierDrawCount: 'Historical Hits',
    dossierDrawsAbsent: 'Absence Count',
    dossierJustDrawn: 'Drawn in latest cycle!',
    dossierAbsenceLabel: 'Draws without appearance',
    dossierEvalTitle: 'Quant-Nexus Algorithm Evaluation',
    dossierEvalHot: 'This number has strong momentum recurrence across recent statistical cycles',
    dossierEvalCold: 'Prolonged absence over 8 draws creates measurable mean-reversion pressure',
    dossierEvalNeutral: 'This number is within standard expected variance bounds',
    dossierCloseBtn: 'CLOSE DOSSIER',
    
    warRoomTitle: 'LIVE WAR ROOM (DRAW SIMULATOR)',
    warRoomDesc: 'Real-time interactive sphere simulator narrowing candidate probability as each ball drops',
    warRoomButton: 'START LIVE DRAW SIMULATION',
    warRoomTens: 'TENS POSITION',
    warRoomUnits: 'UNITS POSITION',
    warRoomLocked: 'LOCKED',
    warRoomWinner: 'WINNER',
    warRoomAwaiting: 'Awaiting Draw (100 combinations)',
    warRoomShrunk: 'Tens digit locked // Pool narrowed to 10',
    warRoomCompleted: 'Draw Complete // Winning result is',
    warRoomInstruction: 'to simulate real-time probability narrowing as each ball drops',
    warRoomEliminatedNotice: 'Eliminated 90% of non-matching numbers! Only 10 active candidates remain:',
    warRoomResultPrefix: '2-Digit Winning Result:',
    warRoomVerifiedEngine: 'Verified and committed to Quant-Nexus Data Lake',
    warRoomResetBtn: 'RESET',
    
    proofTitle: 'PUBLIC PROOF-OF-ALGORITHM',
    proofBadge: 'SHA-256 COMMITMENT',
    proofDesc: 'Public verifiability ledger. SHA-256 hashes generated and committed 2 hours prior to draw',
    proofHitRateLabel: 'OVERALL HIT-RATE (TOP-5)',
    proofVerifiedDrawsLabel: 'VERIFIED DRAWS',
    proofDrawUnit: 'draws',
    proofGuaranteeTitle: 'Cryptographic Guarantee:',
    proofGuaranteeText: 'The system computes and posts cryptographic SHA-256 commitments of Top-5 predictions prior to ball release',
    proofTableTitle: 'HISTORICAL PROOF LEDGER (AUDITED RECORDS)',
    proofAuditedBadge: 'STATUS: AUDITED & VERIFIED',
    proofThDateMarket: 'DRAW DATE / MARKET',
    proofThPredictions: 'PREDICTED TOP-5',
    proofThActual: 'ACTUAL WINNING',
    proofThResult: 'RESULT MATCH',
    proofThHash: 'SHA-256 COMMITMENT',
    proofCopied: 'Copied hash to clipboard!',

    guideTitle: 'QUANTLOTTO BEGINNER QUICK-START GUIDE',
    guideSub: 'Learn how to navigate and extract top probability picks in 60 seconds!',
    guideChapter1Title: 'Step 1: Check Top 5 Quant Candidates (Alpha Picks)',
    guideChapter1Desc: 'Look at the RANK #1 to #5 cards generated from 100,000 probabilistic simulation runs (toggle 2D/3D anytime)',
    guideChapter2Title: 'Step 2: Check your favorite number in Heatmap 00-99',
    guideChapter2Desc: 'Inspect whether your number is in a Hot momentum phase (Green) or Cold absence rebound phase (Cyan)',
    guideChapter3Title: 'Step 3: Enter the Live War Room on draw day',
    guideChapter3Desc: 'Watch the system instantly eliminate 90% of combinations in real time as the first ball drops!',
    step1Title: '1. Check Top 5 Quant Candidates (2D & 3D Picks)',
    step1Desc: 'Toggle [2D] or [3D] to view algorithmic top picks',
    step2Title: '2. Look up your favorite number in Heatmap 00-99',
    step2Desc: 'Inspect whether your number is in a Hot momentum phase or Cold mean-reversion phase',
    step3Title: '3. Enter the Live War Room on draw day',
    step3Desc: 'Watch the system instantly eliminate 90% of combinations in real time as the first ball drops!',
    gotItBtn: 'GOT IT, ENTER TERMINAL!',

    adSlotTitle: 'AUTONOMOUS REVENUE // SPONSOR & ADSENSE SLOT',
    adSlotDesc: 'Autonomous cash flow stream: Direct premium sponsor banners or Google AdSense Financial Network',
    adSlotEst: 'EST. REVENUE: 30K - 100K/MO',
    lineBotTitle: 'LINE OA ALERT BOT',
    lineBotDesc: 'Receive instant draw alerts and statistical picks',
    lineBotBtn: 'ADD LINE',
    footerTitle: 'QUANTLOTTO TERMINAL // QUANT-NEXUS LAB',
    footerDisclaimer: 'Built strictly for quantitative probability and statistical research. Zero gambling facilitation.',
    footerZeroCustomers: '100% AUTONOMOUS // ZERO CUSTOMERS'
  }
};
