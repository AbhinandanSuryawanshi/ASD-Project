from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
from pathlib import Path
import os

REPORTS_DIR = Path(__file__).parent / 'reports'
REPORTS_DIR.mkdir(exist_ok=True)

def get_recommendations(risk_level: str, behavioral_data: dict, demographic_data: dict):
    """Generate comprehensive recommendations based on assessment results"""
    
    age = demographic_data.get('age', 0)
    
    # Base recommendations structure
    recommendations = {
        'medical': [],
        'therapy': [],
        'yoga': [],
        'lifestyle': [],
        'nutrition': []
    }
    
    if risk_level == "High":
        recommendations['medical'] = [
            "Consult with a developmental pediatrician or child psychiatrist for comprehensive evaluation",
            "Consider Applied Behavior Analysis (ABA) therapy - evidence-based intervention",
            "Discuss medication options with psychiatrist if co-occurring conditions exist (anxiety, ADHD, sleep issues)",
            "Medications may include: Risperidone or Aripiprazole for irritability (FDA approved for ASD)",
            "Melatonin supplements for sleep regulation (consult doctor for dosage)",
            "Regular monitoring and follow-ups every 3-6 months"
        ]
        
        recommendations['therapy'] = [
            "Applied Behavior Analysis (ABA): 20-40 hours per week recommended",
            "Speech and Language Therapy: Focus on communication skills and social pragmatics",
            "Occupational Therapy: Address sensory processing and fine motor skills",
            "Social Skills Training: Group sessions for peer interaction",
            "Cognitive Behavioral Therapy (CBT): For managing anxiety and emotional regulation",
            "Parent training programs: PCIT (Parent-Child Interaction Therapy) or similar"
        ]
        
        recommendations['yoga'] = [
            "Child's Pose (Balasana): Calming effect, reduces anxiety - 2 minutes daily",
            "Tree Pose (Vrksasana): Improves balance and focus - 1 minute each leg",
            "Cat-Cow Stretch (Marjaryasana-Bitilasana): Body awareness and coordination - 5 repetitions",
            "Butterfly Pose (Baddha Konasana): Hip opening and calming - 2 minutes",
            "Deep Breathing (Pranayama): 5-10 minutes daily for emotional regulation",
            "Progressive Muscle Relaxation: Before bedtime for better sleep"
        ]
        
        recommendations['lifestyle'] = [
            "Establish consistent daily routines with visual schedules",
            "Create a sensory-friendly environment at home (quiet spaces, soft lighting)",
            "Limit screen time to 1-2 hours daily with educational content",
            "Encourage physical activity: 60 minutes daily (swimming, cycling, dancing)",
            "Use social stories to prepare for new situations or transitions",
            "Implement positive reinforcement strategies consistently"
        ]
        
        recommendations['nutrition'] = [
            "Gluten-free, casein-free diet (GFCF) - consult nutritionist before starting",
            "Omega-3 fatty acids: Fish oil supplements (500-1000mg daily)",
            "Probiotic-rich foods: Yogurt, kefir for gut health",
            "Avoid artificial colors, preservatives, and high-sugar foods",
            "Ensure adequate vitamin D (sunlight exposure or supplements)",
            "Zinc and magnesium supplements if deficient (blood test recommended)"
        ]
    
    elif risk_level == "Moderate":
        recommendations['medical'] = [
            "Schedule evaluation with developmental pediatrician within 3 months",
            "Consider Early Intervention Program (EIP) referral if under 3 years old",
            "Monitor developmental milestones closely",
            "Discuss preventive strategies with healthcare provider",
            "Annual comprehensive developmental screening recommended"
        ]
        
        recommendations['therapy'] = [
            "Speech therapy if communication delays are present",
            "Occupational therapy for sensory sensitivities (2-3 sessions/week)",
            "Play-based therapy for social skill development",
            "Parent coaching sessions to learn supportive strategies",
            "Social skills groups (once weekly)"
        ]
        
        recommendations['yoga'] = [
            "Mountain Pose (Tadasana): Grounding and focus - 1 minute",
            "Warrior Pose (Virabhadrasana): Strength and confidence - 30 seconds each side",
            "Bridge Pose (Setu Bandhasana): Calming and energizing - 1 minute",
            "Seated Forward Bend (Paschimottanasana): Relaxation - 1-2 minutes",
            "Breathing exercises: 5 minutes daily"
        ]
        
        recommendations['lifestyle'] = [
            "Maintain predictable routines with some flexibility",
            "Encourage social play dates in structured settings",
            "Practice turn-taking and sharing through games",
            "Limit sensory overload in busy environments",
            "Use visual supports for daily activities",
            "Promote physical activities: team sports or group classes"
        ]
        
        recommendations['nutrition'] = [
            "Balanced diet with plenty of fruits and vegetables",
            "Omega-3 rich foods: Salmon, walnuts, flaxseeds",
            "Limit processed foods and added sugars",
            "Ensure adequate hydration throughout the day",
            "Consider multivitamin if dietary intake is limited"
        ]
    
    else:  # Low risk
        recommendations['medical'] = [
            "Continue regular pediatric check-ups",
            "Monitor developmental milestones per age guidelines",
            "Stay informed about developmental health",
            "Consult healthcare provider if new concerns arise"
        ]
        
        recommendations['therapy'] = [
            "No specific interventions required currently",
            "Consider enrichment activities for overall development",
            "Encourage social interaction through playgroups or activities"
        ]
        
        recommendations['yoga'] = [
            "General yoga practice for wellness (10-15 minutes daily)",
            "Sun Salutation (Surya Namaskar): Morning routine",
            "Simple breathing exercises for stress management",
            "Mindfulness activities: 5 minutes daily"
        ]
        
        recommendations['lifestyle'] = [
            "Maintain healthy sleep schedule (9-11 hours for children)",
            "Encourage diverse social interactions",
            "Promote physical activity and outdoor play",
            "Limit screen time according to age-appropriate guidelines",
            "Foster creative expression through arts and music"
        ]
        
        recommendations['nutrition'] = [
            "Follow balanced, nutritious diet",
            "Encourage variety in food choices",
            "Limit junk food and sugary beverages",
            "Promote healthy eating habits and family meals"
        ]
    
    return recommendations

def generate_pdf_report(assessment_id: str, assessment_data: dict, output_path: str = None):
    """Generate comprehensive PDF report for assessment"""
    
    if output_path is None:
        output_path = REPORTS_DIR / f"assessment_{assessment_id}.pdf"
    
    # Ensure output directory exists
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    
    # Validate and extract assessment data with defaults
    risk_level = assessment_data.get('risk_level', 'Unknown')
    probability = float(assessment_data.get('probability', 0.0))
    confidence = float(assessment_data.get('confidence', 0.0))
    demographic = assessment_data.get('demographic', {})
    behavioral = assessment_data.get('behavioral', {})
    
    # Set defaults for missing demographic fields
    if not isinstance(demographic, dict):
        demographic = {}
    demo_defaults = {
        'age': 0,
        'gender': 0,
        'ethnicity': 0,
        'country': 'Unknown',
        'jaundice': 0,
        'family_history': 0,
        'respondent': 'Unknown'
    }
    for key, default_val in demo_defaults.items():
        if key not in demographic:
            demographic[key] = default_val
    
    # Set defaults for missing behavioral fields
    if not isinstance(behavioral, dict):
        behavioral = {}
    for i in range(1, 11):
        key = f'a{i}_score'
        if key not in behavioral:
            behavioral[key] = 0
    
    doc = SimpleDocTemplate(str(output_path), pagesize=letter,
                           rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#0F5A5C'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#0F5A5C'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=13,
        textColor=colors.HexColor('#0F5A5C'),
        spaceAfter=8,
        spaceBefore=8,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        alignment=TA_JUSTIFY
    )
    
    # Title
    elements.append(Paragraph("ASD SCREENING ASSESSMENT REPORT", title_style))
    elements.append(Spacer(1, 12))
    
    # Report Info with Name and Image
    report_date = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    elements.append(Paragraph(f"<b>Report Generated:</b> {report_date}", normal_style))
    elements.append(Paragraph(f"<b>Assessment ID:</b> {assessment_id}", normal_style))
    
    # Add name if available
    if demographic.get('name'):
        elements.append(Paragraph(f"<b>Subject Name:</b> {demographic['name']}", normal_style))
    
    elements.append(Spacer(1, 15))
    
    # Add image if available
    image_filename = assessment_data.get('image_filename')
    if image_filename:
        try:
            from reportlab.platypus import Image
            image_path = Path(__file__).parent / 'uploads' / image_filename
            if image_path.exists():
                # Add image with fixed dimensions
                img = Image(str(image_path), width=2*inch, height=2.5*inch)
                elements.append(img)
                elements.append(Spacer(1, 15))
        except Exception as e:
            print(f"Could not add image to PDF: {e}")
    
    elements.append(Spacer(1, 5))
    
    # Risk Level Summary Box
    risk_level_str = str(risk_level)
    probability_pct = probability * 100
    confidence_pct = confidence * 100
    
    risk_color = colors.green if risk_level_str == "Low" else (colors.orange if risk_level_str == "Moderate" else colors.red)
    
    elements.append(Paragraph("ASSESSMENT RESULTS", heading_style))
    
    summary_data = [
        ['Risk Level:', f"{risk_level_str}"],
        ['ASD Probability:', f"{probability_pct:.1f}%"],
        ['Model Confidence:', f"{confidence_pct:.1f}%"]
    ]
    
    summary_table = Table(summary_data, colWidths=[2*inch, 3*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#E6F2F2')),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 20))
    
    # Demographic Information
    elements.append(Paragraph("DEMOGRAPHIC INFORMATION", heading_style))
    demo_data = [
        ['Name:', str(demographic.get('name', 'Not provided'))],
        ['Age:', f"{demographic['age']} years"],
        ['Gender:', 'Male' if demographic['gender'] == 0 else 'Female'],
        ['Country:', str(demographic['country'])],
        ['Jaundice at Birth:', 'Yes' if demographic['jaundice'] == 1 else 'No'],
        ['Family History of ASD:', 'Yes' if demographic['family_history'] == 1 else 'No'],
        ['Respondent:', str(demographic['respondent'])]
    ]
    
    demo_table = Table(demo_data, colWidths=[2.5*inch, 2.5*inch])
    demo_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F5F5F4')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(demo_table)
    elements.append(Spacer(1, 20))
    
    # Behavioral Assessment
    elements.append(Paragraph("BEHAVIORAL ASSESSMENT (AQ-10)", heading_style))
    behavioral = assessment_data['behavioral']
    
    questions_labels = [
        ('Q1', 'Sensory Awareness'),
        ('Q2', 'Attention to Detail'),
        ('Q3', 'Social Attention'),
        ('Q4', 'Attention Switching'),
        ('Q5', 'Cognitive Flexibility'),
        ('Q6', 'Communication'),
        ('Q7', 'Social Awareness'),
        ('Q8', 'Social Imagination'),
        ('Q9', 'Pattern Interests'),
        ('Q10', 'Social Intuition')
    ]
    
    behavioral_data = [['Question', 'Domain', 'Response']]
    for i, (q_num, label) in enumerate(questions_labels, 1):
        score_key = f'a{i}_score'
        response = 'Yes' if behavioral[score_key] == 1 else 'No'
        behavioral_data.append([q_num, label, response])
    
    behavioral_table = Table(behavioral_data, colWidths=[0.8*inch, 2.5*inch, 1.2*inch])
    behavioral_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F5A5C')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F4')]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(behavioral_table)
    elements.append(PageBreak())
    
    # Recommendations Section
    elements.append(Paragraph("COMPREHENSIVE RECOMMENDATIONS", heading_style))
    elements.append(Spacer(1, 10))
    
    recommendations = get_recommendations(risk_level_str, behavioral, demographic)
    
    # Medical Recommendations
    elements.append(Paragraph("1. Medical Consultation & Treatment", subheading_style))
    for rec in recommendations['medical']:
        elements.append(Paragraph(f"• {rec}", normal_style))
        elements.append(Spacer(1, 6))
    elements.append(Spacer(1, 12))
    
    # Therapy Recommendations
    elements.append(Paragraph("2. Therapeutic Interventions", subheading_style))
    for rec in recommendations['therapy']:
        elements.append(Paragraph(f"• {rec}", normal_style))
        elements.append(Spacer(1, 6))
    elements.append(Spacer(1, 12))
    
    # Yoga & Mindfulness
    elements.append(Paragraph("3. Yoga & Mindfulness Practices", subheading_style))
    for rec in recommendations['yoga']:
        elements.append(Paragraph(f"• {rec}", normal_style))
        elements.append(Spacer(1, 6))
    elements.append(Spacer(1, 12))
    
    # Lifestyle Modifications
    elements.append(Paragraph("4. Lifestyle Modifications", subheading_style))
    for rec in recommendations['lifestyle']:
        elements.append(Paragraph(f"• {rec}", normal_style))
        elements.append(Spacer(1, 6))
    elements.append(Spacer(1, 12))
    
    # Nutrition
    elements.append(Paragraph("5. Nutritional Recommendations", subheading_style))
    for rec in recommendations['nutrition']:
        elements.append(Paragraph(f"• {rec}", normal_style))
        elements.append(Spacer(1, 6))
    elements.append(Spacer(1, 20))
    
    # Disclaimer
    elements.append(PageBreak())
    elements.append(Paragraph("IMPORTANT MEDICAL DISCLAIMER", heading_style))
    disclaimer_text = """
    This assessment report is generated by an AI-powered screening tool and is NOT a clinical diagnosis. 
    The results should be used as a reference point for discussions with qualified healthcare professionals. 
    All recommendations provided are general guidelines and must be customized by licensed medical practitioners 
    based on individual needs, medical history, and comprehensive evaluation.
    <br/><br/>
    <b>Always consult with:</b><br/>
    • Licensed pediatrician or family physician<br/>
    • Developmental pediatrician or child psychiatrist<br/>
    • Certified therapists (ABA, OT, Speech, etc.)<br/>
    • Registered dietitian for nutritional advice<br/>
    <br/>
    <b>Do not:</b><br/>
    • Self-diagnose or self-medicate based on this report<br/>
    • Start any medication without professional prescription<br/>
    • Discontinue existing treatments without consulting your doctor<br/>
    • Delay seeking professional medical advice<br/>
    <br/>
    This report is for informational purposes only and does not establish a doctor-patient relationship.
    """
    elements.append(Paragraph(disclaimer_text, normal_style))
    elements.append(Spacer(1, 20))
    
    # Footer
    footer_text = f"<i>Report generated by ASD Screening System | {report_date}</i>"
    elements.append(Paragraph(footer_text, normal_style))
    
    # Build PDF
    doc.build(elements)
    
    return str(output_path)
