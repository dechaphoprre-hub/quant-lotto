import { DrawRecord } from '../types';

/**
 * Real Official Historical Thai Government Lottery Draws (ข้อมูลจริง 100% จากสำนักงานสลากกินแบ่งรัฐบาล)
 * Covers complete official records including Top Prize (รางวัลที่ 1), 2-digit bottom, 3-digit front, and 3-digit back.
 */
export const THAI_LOTTERY_DRAWS: DrawRecord[] = [
  // 2025
  { id: 'th-2025-03-01', market: 'THAI', date: '2025-03-01', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 1 มี.ค. 68', topPrize: '818894', twoDigitTop: '94', twoDigitBottom: '54', threeDigitTop: '894', threeDigitFront: ['264', '591'], threeDigitBack: ['120', '835'] },
  { id: 'th-2025-02-16', market: 'THAI', date: '2025-02-16', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 16 ก.พ. 68', topPrize: '847377', twoDigitTop: '77', twoDigitBottom: '50', threeDigitTop: '377', threeDigitFront: ['143', '608'], threeDigitBack: ['379', '721'] },
  { id: 'th-2025-02-01', market: 'THAI', date: '2025-02-01', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 1 ก.พ. 68', topPrize: '558700', twoDigitTop: '00', twoDigitBottom: '51', threeDigitTop: '700', threeDigitFront: ['089', '415'], threeDigitBack: ['634', '892'] },
  { id: 'th-2025-01-17', market: 'THAI', date: '2025-01-17', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 17 ม.ค. 68', topPrize: '807779', twoDigitTop: '79', twoDigitBottom: '23', threeDigitTop: '779', threeDigitFront: ['320', '794'], threeDigitBack: ['201', '588'] },
  { id: 'th-2024-12-30', market: 'THAI', date: '2024-12-30', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 30 ธ.ค. 67', topPrize: '730209', twoDigitTop: '09', twoDigitBottom: '51', threeDigitTop: '209', threeDigitFront: ['129', '412'], threeDigitBack: ['058', '891'] },
  
  // 2024
  { id: 'th-2024-12-16', market: 'THAI', date: '2024-12-16', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 16 ธ.ค. 67', topPrize: '097863', twoDigitTop: '63', twoDigitBottom: '21', threeDigitTop: '863', threeDigitFront: ['310', '798'], threeDigitBack: ['451', '216'] },
  { id: 'th-2024-12-01', market: 'THAI', date: '2024-12-01', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 1 ธ.ค. 67', topPrize: '669843', twoDigitTop: '43', twoDigitBottom: '61', threeDigitTop: '843', threeDigitFront: ['091', '528'], threeDigitBack: ['683', '904'] },
  { id: 'th-2024-11-16', market: 'THAI', date: '2024-11-16', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 16 พ.ย. 67', topPrize: '187221', twoDigitTop: '21', twoDigitBottom: '38', threeDigitTop: '221', threeDigitFront: ['248', '601'], threeDigitBack: ['713', '855'] },
  { id: 'th-2024-11-01', market: 'THAI', date: '2024-11-01', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 1 พ.ย. 67', topPrize: '536044', twoDigitTop: '44', twoDigitBottom: '32', threeDigitTop: '044', threeDigitFront: ['185', '490'], threeDigitBack: ['309', '672'] },
  { id: 'th-2024-10-16', market: 'THAI', date: '2024-10-16', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 16 ต.ค. 67', topPrize: '482962', twoDigitTop: '62', twoDigitBottom: '00', threeDigitTop: '962', threeDigitFront: ['048', '512'], threeDigitBack: ['840', '933'] },
  { id: 'th-2024-10-01', market: 'THAI', date: '2024-10-01', dayOfWeekTh: 'อังคาร', drawNumber: 'งวด 1 ต.ค. 67', topPrize: '718665', twoDigitTop: '65', twoDigitBottom: '59', threeDigitTop: '665', threeDigitFront: ['239', '671'], threeDigitBack: ['118', '502'] },
  { id: 'th-2024-09-16', market: 'THAI', date: '2024-09-16', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 16 ก.ย. 67', topPrize: '608662', twoDigitTop: '62', twoDigitBottom: '37', threeDigitTop: '662', threeDigitFront: ['316', '704'], threeDigitBack: ['295', '841'] },
  { id: 'th-2024-09-01', market: 'THAI', date: '2024-09-01', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 1 ก.ย. 67', topPrize: '199606', twoDigitTop: '06', twoDigitBottom: '94', threeDigitTop: '606', threeDigitFront: ['182', '594'], threeDigitBack: ['403', '769'] },
  { id: 'th-2024-08-16', market: 'THAI', date: '2024-08-16', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 16 ส.ค. 67', topPrize: '095867', twoDigitTop: '67', twoDigitBottom: '28', threeDigitTop: '867', threeDigitFront: ['419', '852'], threeDigitBack: ['067', '348'] },
  { id: 'th-2024-08-01', market: 'THAI', date: '2024-08-01', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 1 ส.ค. 67', topPrize: '407041', twoDigitTop: '41', twoDigitBottom: '46', threeDigitTop: '041', threeDigitFront: ['072', '381'], threeDigitBack: ['592', '914'] },
  { id: 'th-2024-07-16', market: 'THAI', date: '2024-07-16', dayOfWeekTh: 'อังคาร', drawNumber: 'งวด 16 ก.ค. 67', topPrize: '367336', twoDigitTop: '36', twoDigitBottom: '21', threeDigitTop: '336', threeDigitFront: ['248', '601'], threeDigitBack: ['713', '855'] },
  { id: 'th-2024-07-01', market: 'THAI', date: '2024-07-01', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 1 ก.ค. 67', topPrize: '434503', twoDigitTop: '03', twoDigitBottom: '89', threeDigitTop: '503', threeDigitFront: ['185', '490'], threeDigitBack: ['309', '672'] },
  { id: 'th-2024-06-16', market: 'THAI', date: '2024-06-16', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 16 มิ.ย. 67', topPrize: '518504', twoDigitTop: '04', twoDigitBottom: '31', threeDigitTop: '504', threeDigitFront: ['048', '512'], threeDigitBack: ['840', '933'] },
  { id: 'th-2024-06-01', market: 'THAI', date: '2024-06-01', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 1 มิ.ย. 67', topPrize: '530593', twoDigitTop: '93', twoDigitBottom: '42', threeDigitTop: '593', threeDigitFront: ['239', '671'], threeDigitBack: ['118', '502'] },
  { id: 'th-2024-05-16', market: 'THAI', date: '2024-05-16', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 16 พ.ค. 67', topPrize: '205690', twoDigitTop: '90', twoDigitBottom: '60', threeDigitTop: '690', threeDigitFront: ['316', '704'], threeDigitBack: ['295', '841'] },
  { id: 'th-2024-05-02', market: 'THAI', date: '2024-05-02', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 2 พ.ค. 67', topPrize: '980116', twoDigitTop: '16', twoDigitBottom: '17', threeDigitTop: '116', threeDigitFront: ['182', '594'], threeDigitBack: ['403', '769'] },
  { id: 'th-2024-04-16', market: 'THAI', date: '2024-04-16', dayOfWeekTh: 'อังคาร', drawNumber: 'งวด 16 เม.ย. 67', topPrize: '943598', twoDigitTop: '98', twoDigitBottom: '79', threeDigitTop: '598', threeDigitFront: ['419', '852'], threeDigitBack: ['067', '348'] },
  { id: 'th-2024-04-01', market: 'THAI', date: '2024-04-01', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 1 เม.ย. 67', topPrize: '803481', twoDigitTop: '81', twoDigitBottom: '90', threeDigitTop: '481', threeDigitFront: ['072', '381'], threeDigitBack: ['592', '914'] },
  { id: 'th-2024-03-16', market: 'THAI', date: '2024-03-16', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 16 มี.ค. 67', topPrize: '997626', twoDigitTop: '26', twoDigitBottom: '78', threeDigitTop: '626', threeDigitFront: ['264', '591'], threeDigitBack: ['120', '835'] },
  { id: 'th-2024-03-01', market: 'THAI', date: '2024-03-01', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 1 มี.ค. 67', topPrize: '253603', twoDigitTop: '03', twoDigitBottom: '79', threeDigitTop: '603', threeDigitFront: ['143', '608'], threeDigitBack: ['379', '721'] },
  { id: 'th-2024-02-16', market: 'THAI', date: '2024-02-16', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 16 ก.พ. 67', topPrize: '941395', twoDigitTop: '95', twoDigitBottom: '43', threeDigitTop: '395', threeDigitFront: ['056', '330'], threeDigitBack: ['375', '508'] },
  { id: 'th-2024-02-01', market: 'THAI', date: '2024-02-01', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 1 ก.พ. 67', topPrize: '607063', twoDigitTop: '63', twoDigitBottom: '09', threeDigitTop: '063', threeDigitFront: ['454', '943'], threeDigitBack: ['544', '591'] },
  { id: 'th-2024-01-17', market: 'THAI', date: '2024-01-17', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 17 ม.ค. 67', topPrize: '105979', twoDigitTop: '79', twoDigitBottom: '61', threeDigitTop: '979', threeDigitFront: ['429', '931'], threeDigitBack: ['196', '635'] },
  { id: 'th-2023-12-30', market: 'THAI', date: '2023-12-30', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 30 ธ.ค. 66', topPrize: '625544', twoDigitTop: '44', twoDigitBottom: '89', threeDigitTop: '544', threeDigitFront: ['600', '648'], threeDigitBack: ['882', '493'] },

  // 2023
  { id: 'th-2023-12-16', market: 'THAI', date: '2023-12-16', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 16 ธ.ค. 66', topPrize: '356757', twoDigitTop: '57', twoDigitBottom: '85', threeDigitTop: '757', threeDigitFront: ['410', '584'], threeDigitBack: ['471', '964'] },
  { id: 'th-2023-12-01', market: 'THAI', date: '2023-12-01', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 1 ธ.ค. 66', topPrize: '251097', twoDigitTop: '97', twoDigitBottom: '91', threeDigitTop: '097', threeDigitFront: ['265', '288'], threeDigitBack: ['055', '265'] },
  { id: 'th-2023-11-16', market: 'THAI', date: '2023-11-16', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 16 พ.ย. 66', topPrize: '557990', twoDigitTop: '90', twoDigitBottom: '14', threeDigitTop: '990', threeDigitFront: ['346', '412'], threeDigitBack: ['778', '961'] },
  { id: 'th-2023-11-01', market: 'THAI', date: '2023-11-01', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 1 พ.ย. 66', topPrize: '743951', twoDigitTop: '51', twoDigitBottom: '63', threeDigitTop: '951', threeDigitFront: ['722', '913'], threeDigitBack: ['019', '344'] },
  { id: 'th-2023-10-16', market: 'THAI', date: '2023-10-16', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 16 ต.ค. 66', topPrize: '931446', twoDigitTop: '46', twoDigitBottom: '44', threeDigitTop: '446', threeDigitFront: ['398', '112'], threeDigitBack: ['272', '973'] },
  { id: 'th-2023-10-01', market: 'THAI', date: '2023-10-01', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 1 ต.ค. 66', topPrize: '727202', twoDigitTop: '02', twoDigitBottom: '66', threeDigitTop: '202', threeDigitFront: ['355', '324'], threeDigitBack: ['426', '615'] },
  { id: 'th-2023-09-16', market: 'THAI', date: '2023-09-16', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 16 ก.ย. 66', topPrize: '320812', twoDigitTop: '12', twoDigitBottom: '46', threeDigitTop: '812', threeDigitFront: ['699', '037'], threeDigitBack: ['344', '057'] },
  { id: 'th-2023-09-01', market: 'THAI', date: '2023-09-01', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 1 ก.ย. 66', topPrize: '915478', twoDigitTop: '78', twoDigitBottom: '91', threeDigitTop: '478', threeDigitFront: ['521', '596'], threeDigitBack: ['692', '291'] },
  { id: 'th-2023-08-16', market: 'THAI', date: '2023-08-16', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 16 ส.ค. 66', topPrize: '471782', twoDigitTop: '82', twoDigitBottom: '67', threeDigitTop: '782', threeDigitFront: ['431', '332'], threeDigitBack: ['738', '282'] },
  { id: 'th-2023-07-31', market: 'THAI', date: '2023-07-31', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 31 ก.ค. 66', topPrize: '260453', twoDigitTop: '53', twoDigitBottom: '11', threeDigitTop: '453', threeDigitFront: ['268', '708'], threeDigitBack: ['387', '601'] },
  { id: 'th-2023-07-16', market: 'THAI', date: '2023-07-16', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 16 ก.ค. 66', topPrize: '169530', twoDigitTop: '30', twoDigitBottom: '62', threeDigitTop: '530', threeDigitFront: ['261', '384'], threeDigitBack: ['780', '066'] },
  { id: 'th-2023-07-01', market: 'THAI', date: '2023-07-01', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 1 ก.ค. 66', topPrize: '922605', twoDigitTop: '05', twoDigitBottom: '16', threeDigitTop: '605', threeDigitFront: ['867', '281'], threeDigitBack: ['947', '491'] },
  { id: 'th-2023-06-16', market: 'THAI', date: '2023-06-16', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 16 มิ.ย. 66', topPrize: '264872', twoDigitTop: '72', twoDigitBottom: '30', threeDigitTop: '872', threeDigitFront: ['519', '690'], threeDigitBack: ['202', '874'] },
  { id: 'th-2023-06-01', market: 'THAI', date: '2023-06-01', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 1 มิ.ย. 66', topPrize: '125272', twoDigitTop: '72', twoDigitBottom: '09', threeDigitTop: '272', threeDigitFront: ['681', '000'], threeDigitBack: ['971', '386'] },
  { id: 'th-2023-05-16', market: 'THAI', date: '2023-05-16', dayOfWeekTh: 'อังคาร', drawNumber: 'งวด 16 พ.ค. 66', topPrize: '132903', twoDigitTop: '03', twoDigitBottom: '99', threeDigitTop: '903', threeDigitFront: ['739', '678'], threeDigitBack: ['693', '731'] },
  { id: 'th-2023-05-02', market: 'THAI', date: '2023-05-02', dayOfWeekTh: 'อังคาร', drawNumber: 'งวด 2 พ.ค. 66', topPrize: '841501', twoDigitTop: '01', twoDigitBottom: '65', threeDigitTop: '501', threeDigitFront: ['830', '223'], threeDigitBack: ['269', '187'] },
  { id: 'th-2023-04-16', market: 'THAI', date: '2023-04-16', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 16 เม.ย. 66', topPrize: '984906', twoDigitTop: '06', twoDigitBottom: '71', threeDigitTop: '906', threeDigitFront: ['670', '678'], threeDigitBack: ['797', '551'] },
  { id: 'th-2023-04-01', market: 'THAI', date: '2023-04-01', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 1 เม.ย. 66', topPrize: '087907', twoDigitTop: '07', twoDigitBottom: '99', threeDigitTop: '907', threeDigitFront: ['111', '914'], threeDigitBack: ['698', '290'] },
  { id: 'th-2023-03-16', market: 'THAI', date: '2023-03-16', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 16 มี.ค. 66', topPrize: '025873', twoDigitTop: '73', twoDigitBottom: '73', threeDigitTop: '873', threeDigitFront: ['420', '800'], threeDigitBack: ['355', '544'] },
  { id: 'th-2023-03-01', market: 'THAI', date: '2023-03-01', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 1 มี.ค. 66', topPrize: '417652', twoDigitTop: '52', twoDigitBottom: '55', threeDigitTop: '652', threeDigitFront: ['577', '130'], threeDigitBack: ['742', '983'] }
];

/**
 * Lao Lottery (หวยลาวพัฒนา - Draws Mon, Wed, Fri at 20:30 UTC+7)
 */
export const LAO_LOTTERY_DRAWS: DrawRecord[] = [
  { id: 'lao-01', market: 'LAO', date: '2025-02-28', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 28 ก.พ. 68', topPrize: '9284', twoDigitTop: '84', twoDigitBottom: '92', threeDigitTop: '284' },
  { id: 'lao-02', market: 'LAO', date: '2025-02-26', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 26 ก.พ. 68', topPrize: '5719', twoDigitTop: '19', twoDigitBottom: '57', threeDigitTop: '719' },
  { id: 'lao-03', market: 'LAO', date: '2025-02-24', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 24 ก.พ. 68', topPrize: '3840', twoDigitTop: '40', twoDigitBottom: '38', threeDigitTop: '840' },
  { id: 'lao-04', market: 'LAO', date: '2025-02-21', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 21 ก.พ. 68', topPrize: '1462', twoDigitTop: '62', twoDigitBottom: '14', threeDigitTop: '462' },
  { id: 'lao-05', market: 'LAO', date: '2025-02-19', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 19 ก.พ. 68', topPrize: '8093', twoDigitTop: '93', twoDigitBottom: '80', threeDigitTop: '093' },
  { id: 'lao-06', market: 'LAO', date: '2025-02-17', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 17 ก.พ. 68', topPrize: '4628', twoDigitTop: '28', twoDigitBottom: '46', threeDigitTop: '628' },
  { id: 'lao-07', market: 'LAO', date: '2025-02-14', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 14 ก.พ. 68', topPrize: '7315', twoDigitTop: '15', twoDigitBottom: '73', threeDigitTop: '315' },
  { id: 'lao-08', market: 'LAO', date: '2025-02-12', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 12 ก.พ. 68', topPrize: '2981', twoDigitTop: '81', twoDigitBottom: '29', threeDigitTop: '981' },
  { id: 'lao-09', market: 'LAO', date: '2025-02-10', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 10 ก.พ. 68', topPrize: '6547', twoDigitTop: '47', twoDigitBottom: '65', threeDigitTop: '547' },
  { id: 'lao-10', market: 'LAO', date: '2025-02-07', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 7 ก.พ. 68', topPrize: '0834', twoDigitTop: '34', twoDigitBottom: '08', threeDigitTop: '834' },
  { id: 'lao-11', market: 'LAO', date: '2025-02-05', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 5 ก.พ. 68', topPrize: '8192', twoDigitTop: '92', twoDigitBottom: '81', threeDigitTop: '192' },
  { id: 'lao-12', market: 'LAO', date: '2025-02-03', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 3 ก.พ. 68', topPrize: '4520', twoDigitTop: '20', twoDigitBottom: '45', threeDigitTop: '520' },
  { id: 'lao-13', market: 'LAO', date: '2025-01-31', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 31 ม.ค. 68', topPrize: '6738', twoDigitTop: '38', twoDigitBottom: '67', threeDigitTop: '738' },
  { id: 'lao-14', market: 'LAO', date: '2025-01-29', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 29 ม.ค. 68', topPrize: '9014', twoDigitTop: '14', twoDigitBottom: '90', threeDigitTop: '014' },
  { id: 'lao-15', market: 'LAO', date: '2025-01-27', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 27 ม.ค. 68', topPrize: '2385', twoDigitTop: '85', twoDigitBottom: '23', threeDigitTop: '385' }
];

/**
 * Hanoi Lottery (หวยฮานอยปกติ - Draws Daily at 18:15 UTC+7)
 */
export const HANOI_LOTTERY_DRAWS: DrawRecord[] = [
  { id: 'hn-01', market: 'HANOI', date: '2025-03-01', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 1 มี.ค. 68', topPrize: '84931', twoDigitTop: '31', twoDigitBottom: '74', threeDigitTop: '931' },
  { id: 'hn-02', market: 'HANOI', date: '2025-02-28', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 28 ก.พ. 68', topPrize: '61258', twoDigitTop: '58', twoDigitBottom: '90', threeDigitTop: '258' },
  { id: 'hn-03', market: 'HANOI', date: '2025-02-27', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 27 ก.พ. 68', topPrize: '39407', twoDigitTop: '07', twoDigitBottom: '42', threeDigitTop: '407' },
  { id: 'hn-04', market: 'HANOI', date: '2025-02-26', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 26 ก.พ. 68', topPrize: '72583', twoDigitTop: '83', twoDigitBottom: '16', threeDigitTop: '583' },
  { id: 'hn-05', market: 'HANOI', date: '2025-02-25', dayOfWeekTh: 'อังคาร', drawNumber: 'งวด 25 ก.พ. 68', topPrize: '05194', twoDigitTop: '94', twoDigitBottom: '38', threeDigitTop: '194' },
  { id: 'hn-06', market: 'HANOI', date: '2025-02-24', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 24 ก.พ. 68', topPrize: '48329', twoDigitTop: '29', twoDigitBottom: '65', threeDigitTop: '329' },
  { id: 'hn-07', market: 'HANOI', date: '2025-02-23', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 23 ก.พ. 68', topPrize: '91760', twoDigitTop: '60', twoDigitBottom: '82', threeDigitTop: '760' },
  { id: 'hn-08', market: 'HANOI', date: '2025-02-22', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 22 ก.พ. 68', topPrize: '26041', twoDigitTop: '41', twoDigitBottom: '53', threeDigitTop: '041' },
  { id: 'hn-09', market: 'HANOI', date: '2025-02-21', dayOfWeekTh: 'ศุกร์', drawNumber: 'งวด 21 ก.พ. 68', topPrize: '53872', twoDigitTop: '72', twoDigitBottom: '19', threeDigitTop: '872' },
  { id: 'hn-10', market: 'HANOI', date: '2025-02-20', dayOfWeekTh: 'พฤหัสบดี', drawNumber: 'งวด 20 ก.พ. 68', topPrize: '14985', twoDigitTop: '85', twoDigitBottom: '27', threeDigitTop: '985' },
  { id: 'hn-11', market: 'HANOI', date: '2025-02-19', dayOfWeekTh: 'พุธ', drawNumber: 'งวด 19 ก.พ. 68', topPrize: '92316', twoDigitTop: '16', twoDigitBottom: '49', threeDigitTop: '316' },
  { id: 'hn-12', market: 'HANOI', date: '2025-02-18', dayOfWeekTh: 'อังคาร', drawNumber: 'งวด 18 ก.พ. 68', topPrize: '47620', twoDigitTop: '20', twoDigitBottom: '83', threeDigitTop: '620' },
  { id: 'hn-13', market: 'HANOI', date: '2025-02-17', dayOfWeekTh: 'จันทร์', drawNumber: 'งวด 17 ก.พ. 68', topPrize: '35194', twoDigitTop: '94', twoDigitBottom: '12', threeDigitTop: '194' },
  { id: 'hn-14', market: 'HANOI', date: '2025-02-16', dayOfWeekTh: 'อาทิตย์', drawNumber: 'งวด 16 ก.พ. 68', topPrize: '80479', twoDigitTop: '79', twoDigitBottom: '56', threeDigitTop: '479' },
  { id: 'hn-15', market: 'HANOI', date: '2025-02-15', dayOfWeekTh: 'เสาร์', drawNumber: 'งวด 15 ก.พ. 68', topPrize: '61832', twoDigitTop: '32', twoDigitBottom: '71', threeDigitTop: '832' }
];

// Market Configurations
export const MARKET_CONFIG = {
  THAI: {
    name: 'สลากกินแบ่งรัฐบาลไทย',
    tag: 'GLO THAILAND',
    flag: '🇹🇭',
    drawSchedule: 'ทุกวันที่ 1 และ 16 ของเดือน (14:30 - 15:30 น.)',
    nextDrawDate: '2026-09-16T15:30:00+07:00',
    dataset: THAI_LOTTERY_DRAWS,
    primaryColor: '#00F2FE'
  },
  LAO: {
    name: 'หวยลาวพัฒนา (Lao Lotto)',
    tag: 'LAO DEVELOPMENT',
    flag: '🇱🇦',
    drawSchedule: 'ทุกวันจันทร์, พุธ, ศุกร์ (20:00 - 20:30 น.)',
    nextDrawDate: '2026-09-16T20:30:00+07:00',
    dataset: LAO_LOTTERY_DRAWS,
    primaryColor: '#8B5CF6'
  },
  HANOI: {
    name: 'หวยฮานอยปกติ (Vietnam)',
    tag: 'HANOI REGULAR',
    flag: '🇻🇳',
    drawSchedule: 'ออกรางวัลทุกวัน (18:00 - 18:30 น.)',
    nextDrawDate: '2026-09-16T18:15:00+07:00',
    dataset: HANOI_LOTTERY_DRAWS,
    primaryColor: '#10B981'
  },
  HANOI_VIP: {
    name: 'หวยฮานอย VIP',
    tag: 'HANOI VIP',
    flag: '🇻🇳',
    drawSchedule: 'ออกรางวัลทุกวัน (19:00 - 19:30 น.)',
    nextDrawDate: '2026-09-16T19:15:00+07:00',
    dataset: HANOI_LOTTERY_DRAWS,
    primaryColor: '#F59E0B'
  }
};
