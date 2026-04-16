import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "DFW HVAC Site Audit"

# Styles
header_font = Font(bold=True, color="FFFFFF", size=11)
header_fill = PatternFill(start_color="003153", end_color="003153", fill_type="solid")
warning_fill = PatternFill(start_color="FFF3CD", end_color="FFF3CD", fill_type="solid")
null_fill = PatternFill(start_color="F8D7DA", end_color="F8D7DA", fill_type="solid")
section_fill = PatternFill(start_color="E8F5E9", end_color="E8F5E9", fill_type="solid")
section_font = Font(bold=True, size=11)
wrap = Alignment(wrap_text=True, vertical="top")
thin_border = Border(
    left=Side(style="thin"), right=Side(style="thin"),
    top=Side(style="thin"), bottom=Side(style="thin")
)

# Headers
headers = ["Webpage (URL)", "Meta Description", "Status", "CMS Navigation"]
ws.column_dimensions["A"].width = 50
ws.column_dimensions["B"].width = 80
ws.column_dimensions["C"].width = 14
ws.column_dimensions["D"].width = 55

for col, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col, value=header)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = wrap
    cell.border = thin_border

# Data
pages = [
    # Section: Static Pages
    ("SECTION", "Static Pages", "", "", ""),
    ("/", "Family-owned HVAC contractor serving Dallas-Fort Worth. AC and heating diagnosis, repair, installation and maintenance. Call (972) 777-COOL.", "Published", "Sanity > Homepage > metaTitle / metaDescription"),
    ("/about", "Learn about DFW HVAC - a three-generation family commitment to trustworthy, high-quality HVAC service in Dallas-Fort Worth.", "Published", "Sanity > About Page > metaTitle / metaDescription"),
    ("/contact", "Contact DFW HVAC for expert heating and cooling services in Dallas-Fort Worth. Same-day service available Monday-Friday. Call (972) 777-COOL.", "Published", "Sanity > Contact Page > metaTitle / metaDescription"),
    ("/services", "Professional HVAC services in Dallas-Fort Worth. Residential & commercial air conditioning, heating, and maintenance.", "Published", "Hardcoded in code (app/services/page.jsx)"),
    ("/faq", 'WARNING: "Test of the section. One Two Three"', "Published", "Sanity > FAQ Page > metaDescription"),
    ("/reviews", "Read 130+ 5-star reviews from real DFW HVAC customers. Family-owned HVAC contractor serving Dallas-Fort Worth since 1974. See why customers trust us.", "Published", "Sanity > Reviews Page > metaDescription"),
    ("/request-service", "Request HVAC service from DFW HVAC. Fast response, licensed technicians, upfront pricing. Serving Dallas-Fort Worth. Call (972) 777-COOL or fill out our form.", "Published", "Hardcoded in code (app/request-service/page.jsx)"),
    ("/estimate", "Request a free HVAC estimate from DFW HVAC. Expert heating and cooling services in Dallas-Fort Worth. Honest assessments, transparent pricing.", "Published", "Hardcoded in code (app/estimate/page.jsx)"),
    ("/cities-served", "DFW HVAC provides professional HVAC services across the Dallas-Fort Worth metroplex. Find heating and air conditioning services in your city.", "Published", "Hardcoded in code (app/cities-served/page.jsx)"),
    ("/privacy-policy", "Privacy Policy for DFW HVAC. Learn how we collect, use, and protect your personal information.", "Published", "Hardcoded in code (app/privacy-policy/page.jsx)"),
    ("/terms-of-service", "Terms of Service for DFW HVAC. Review the terms and conditions governing your use of our website and HVAC services.", "Published", "Hardcoded in code (app/terms-of-service/page.jsx)"),
    ("/recent-projects", "N/A (307 redirects to /reviews)", "Unpublished", "N/A - will become Showcase Projects page"),

    # Section: Service Pages
    ("SECTION", "Service Pages", "", "", ""),
    ("/services/residential/air-conditioning", "(null - using code fallback)", "Published", "Sanity > Service > Air Conditioning > metaTitle / metaDescription"),
    ("/services/residential/heating", "(null - using code fallback)", "Published", "Sanity > Service > Heating > metaTitle / metaDescription"),
    ("/services/residential/preventative-maintenance", "(null - using code fallback)", "Published", "Sanity > Service > Preventative Maintenance > metaTitle / metaDescription"),
    ("/services/residential/indoor-air-quality", "(null - using code fallback)", "Published", "Sanity > Service > Indoor Air Quality > metaTitle / metaDescription"),
    ("/services/commercial/commercial-air-conditioning", "(null - using code fallback)", "Published", "Sanity > Service > Commercial Air Conditioning > metaTitle / metaDescription"),
    ("/services/commercial/commercial-heating", "(null - using code fallback)", "Published", "Sanity > Service > Commercial Heating > metaTitle / metaDescription"),
    ("/services/commercial/commercial-maintenance", "(null - using code fallback)", "Published", "Sanity > Service > Commercial Maintenance > metaTitle / metaDescription"),

    # Section: City Pages
    ("SECTION", "City Pages (28)", "", "", ""),
    ("/cities-served/allen", "(null - using code fallback)", "Published", "Sanity > City Page > allen"),
    ("/cities-served/argyle", "(null - using code fallback)", "Published", "Sanity > City Page > argyle"),
    ("/cities-served/arlington", "(null - using code fallback)", "Published", "Sanity > City Page > arlington"),
    ("/cities-served/bedford", "(null - using code fallback)", "Published", "Sanity > City Page > bedford"),
    ("/cities-served/carrollton", "(null - using code fallback)", "Published", "Sanity > City Page > carrollton"),
    ("/cities-served/colleyville", "(null - using code fallback)", "Published", "Sanity > City Page > colleyville"),
    ("/cities-served/coppell", "(null - using code fallback)", "Published", "Sanity > City Page > coppell"),
    ("/cities-served/dallas", "(null - using code fallback)", "Published", "Sanity > City Page > dallas"),
    ("/cities-served/denton", "(null - using code fallback)", "Published", "Sanity > City Page > denton"),
    ("/cities-served/euless", "(null - using code fallback)", "Published", "Sanity > City Page > euless"),
    ("/cities-served/farmers-branch", "(null - using code fallback)", "Published", "Sanity > City Page > farmers-branch"),
    ("/cities-served/flower-mound", "(null - using code fallback)", "Published", "Sanity > City Page > flower-mound"),
    ("/cities-served/fort-worth", "(null - using code fallback)", "Published", "Sanity > City Page > fort-worth"),
    ("/cities-served/frisco", "(null - using code fallback)", "Published", "Sanity > City Page > frisco"),
    ("/cities-served/grapevine", "(null - using code fallback)", "Published", "Sanity > City Page > grapevine"),
    ("/cities-served/haslet", "(null - using code fallback)", "Published", "Sanity > City Page > haslet"),
    ("/cities-served/hurst", "(null - using code fallback)", "Published", "Sanity > City Page > hurst"),
    ("/cities-served/irving", "(null - using code fallback)", "Published", "Sanity > City Page > irving"),
    ("/cities-served/keller", "(null - using code fallback)", "Published", "Sanity > City Page > keller"),
    ("/cities-served/lake-dallas", "(null - using code fallback)", "Published", "Sanity > City Page > lake-dallas"),
    ("/cities-served/lewisville", "(null - using code fallback)", "Published", "Sanity > City Page > lewisville"),
    ("/cities-served/mansfield", "(null - using code fallback)", "Published", "Sanity > City Page > mansfield"),
    ("/cities-served/north-richland-hills", "(null - using code fallback)", "Published", "Sanity > City Page > north-richland-hills"),
    ("/cities-served/plano", "(null - using code fallback)", "Published", "Sanity > City Page > plano"),
    ("/cities-served/richardson", "(null - using code fallback)", "Published", "Sanity > City Page > richardson"),
    ("/cities-served/roanoke", "(null - using code fallback)", "Published", "Sanity > City Page > roanoke"),
    ("/cities-served/southlake", "(null - using code fallback)", "Published", "Sanity > City Page > southlake"),
    ("/cities-served/the-colony", "(null - using code fallback)", "Published", "Sanity > City Page > the-colony"),
]

row = 2
for page in pages:
    if page[0] == "SECTION":
        cell = ws.cell(row=row, column=1, value=page[1])
        cell.font = section_font
        cell.fill = section_fill
        for col in range(1, 5):
            ws.cell(row=row, column=col).fill = section_fill
            ws.cell(row=row, column=col).border = thin_border
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=4)
        row += 1
        continue

    url, meta, status, cms_nav = page[0], page[1], page[2], page[3]

    ws.cell(row=row, column=1, value=url).alignment = wrap
    ws.cell(row=row, column=2, value=meta).alignment = wrap
    ws.cell(row=row, column=3, value=status).alignment = Alignment(horizontal="center", vertical="top")
    ws.cell(row=row, column=4, value=cms_nav).alignment = wrap

    for col in range(1, 5):
        ws.cell(row=row, column=col).border = thin_border

    # Highlight issues
    if "WARNING" in meta:
        ws.cell(row=row, column=2).fill = warning_fill
    elif "(null" in meta:
        ws.cell(row=row, column=2).fill = null_fill

    if status == "Unpublished":
        ws.cell(row=row, column=3).fill = PatternFill(start_color="E0E0E0", end_color="E0E0E0", fill_type="solid")

    row += 1

# Legend
row += 1
ws.cell(row=row, column=1, value="Legend:").font = Font(bold=True)
row += 1
ws.cell(row=row, column=1, value="Yellow = Needs immediate fix (test/incorrect data)")
ws.cell(row=row, column=1).fill = warning_fill
row += 1
ws.cell(row=row, column=1, value="Red = No custom meta description set (using generic code fallback)")
ws.cell(row=row, column=1).fill = null_fill

wb.save("/app/frontend/public/DFW_HVAC_Site_Audit.xlsx")
print("Spreadsheet saved!")
