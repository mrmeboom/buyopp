function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Orders');

    // If the tracking tab doesn't exist yet, build it out automatically
    if (!sheet) {
      sheet = ss.insertSheet('Orders');
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Company',
        'Phone / WhatsApp',
        'Email',
        'Shipping Address',
        'Postal & City',
        'Items Ordered',
        'Total (Excl. VAT)',
        'VAT (21%)',
        'Total (Incl. VAT)'
      ]);
      // Apply professional formatting to the header row
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#f3f3f3');
    }

    // Append a single human-readable row
    sheet.appendRow([
      new Date(),
      data.name,
      data.company || 'N/A',
      data.phone   || data.contact || '',   // backwards-compatible fallback
      data.email   || '',
      data.address,
      data.postal,
      data.itemsList,
      '€' + data.totalExVat.toFixed(2),
      '€' + data.vat.toFixed(2),
      '€' + data.totalIncVat.toFixed(2)
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}