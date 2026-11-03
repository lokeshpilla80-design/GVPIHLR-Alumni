const Contact = require('../models/Contact');
const fs = require('fs');
const path = require('path');
const { sendMail, getAdminEmail } = require('../utils/mail');

// Mock data for fallback
const mockContacts = [
  {
    _id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+91 9876543210',
    subject: 'Alumni Registration',
    message: 'I would like to register for the alumni association.',
    type: 'alumni',
    isRead: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Mike Wilson',
    email: 'mike.wilson@email.com',
    phone: '+91 9123456789',
    subject: 'Event Information',
    message: 'Need details about upcoming tech workshop.',
    type: 'events',
    isRead: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all active contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.log('DB error, using mock data:', error.message);
    // Fallback to mock data
    res.json({
      success: true,
      data: mockContacts.filter(contact => contact.isActive)
    });
  }
};

// Get all contacts (including inactive) for admin
exports.getAllContactsAdmin = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.log('DB error, using mock data:', error.message);
    // Fallback to mock data
    try {
      const fallbackFile = path.join(__dirname, '..', '..', 'data', 'contacts-fallback.json');
      let fallback = [];
      if (fs.existsSync(fallbackFile)) {
        const raw = fs.readFileSync(fallbackFile, 'utf8') || '[]';
        fallback = JSON.parse(raw);
      }

      // merge mock data and fallback storage
      const merged = [...fallback, ...mockContacts];
      return res.json({ success: true, data: merged });
    } catch (fsErr) {
      return res.json({ success: true, data: mockContacts });
    }
  }
};

// Get single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
};

// Create new contact
exports.createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    console.log('Contact saved:', { name: contact.name, email: contact.email, phone: contact.phone, subject: contact.subject, type: contact.type });
    console.log('Sending notification to admin emails:', getAdminEmail());

    const adminSubject = `New contact message from ${contact.name}`;
    const adminText = `New message received:\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nSubject: ${contact.subject}\nType: ${contact.type}\n\nMessage:\n${contact.message}`;
    const adminHtml = `<h2>New Contact Submission</h2><p><strong>Name:</strong> ${contact.name}</p><p><strong>Email:</strong> ${contact.email}</p><p><strong>Phone:</strong> ${contact.phone}</p><p><strong>Subject:</strong> ${contact.subject}</p><p><strong>Type:</strong> ${contact.type}</p><p><strong>Message:</strong><br/>${contact.message.replace(/\n/g, '<br/>')}</p>`;

    const visitorSubject = `Thank you for contacting GVP Alumni`;
    const visitorText = `Hi ${contact.name},\n\nThank you for reaching out to Gayatri Vidya Parishad Alumni. We have received your message and will get back to you soon.\n\nYour message:\n${contact.message}\n\nRegards,\nGVP Alumni Team`;
    const visitorHtml = `<p>Hi ${contact.name},</p><p>Thank you for reaching out to Gayatri Vidya Parishad Alumni. We have received your message and will get back to you soon.</p><p><strong>Your message:</strong><br/>${contact.message.replace(/\n/g, '<br/>')}</p><p>Regards,<br/>GVP Alumni Team</p>`;

    await Promise.allSettled([
      sendMail({ to: getAdminEmail(), subject: adminSubject, text: adminText, html: adminHtml }),
      sendMail({ to: contact.email, subject: visitorSubject, text: visitorText, html: visitorHtml })
    ]);

    return res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact submitted successfully'
    });
  } catch (error) {
    // If DB is not available, persist to a fallback JSON file so submissions are not lost
    try {
      const fallbackDir = path.join(__dirname, '..', '..', 'data');
      if (!fs.existsSync(fallbackDir)) fs.mkdirSync(fallbackDir, { recursive: true });
      const fallbackFile = path.join(fallbackDir, 'contacts-fallback.json');
      let fallback = [];
      if (fs.existsSync(fallbackFile)) {
        const raw = fs.readFileSync(fallbackFile, 'utf8') || '[]';
        fallback = JSON.parse(raw);
      }

      const id = Date.now().toString();
      const newContact = {
        _id: id,
        name: req.body.name || 'Anonymous',
        email: req.body.email || '',
        phone: req.body.phone || '',
        subject: req.body.subject || 'general',
        message: req.body.message || '',
        type: req.body.type || 'general',
        isRead: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      fallback.unshift(newContact);
      fs.writeFileSync(fallbackFile, JSON.stringify(fallback, null, 2), 'utf8');

      await Promise.allSettled([
        sendMail({
          to: getAdminEmail(),
          subject: `New contact message from ${newContact.name}`,
          text: `New message received:\n\nName: ${newContact.name}\nEmail: ${newContact.email}\nPhone: ${newContact.phone}\nSubject: ${newContact.subject}\nType: ${newContact.type}\n\nMessage:\n${newContact.message}`,
          html: `<h2>New Contact Submission</h2><p><strong>Name:</strong> ${newContact.name}</p><p><strong>Email:</strong> ${newContact.email}</p><p><strong>Phone:</strong> ${newContact.phone}</p><p><strong>Subject:</strong> ${newContact.subject}</p><p><strong>Type:</strong> ${newContact.type}</p><p><strong>Message:</strong><br/>${newContact.message.replace(/\n/g, '<br/>')}</p>`
        }),
        sendMail({
          to: newContact.email,
          subject: `Thank you for contacting GVP Alumni`,
          text: `Hi ${newContact.name},\n\nThank you for reaching out to Gayatri Vidya Parishad Alumni. We have received your message and will get back to you soon.\n\nYour message:\n${newContact.message}\n\nRegards,\nGVP Alumni Team`,
          html: `<p>Hi ${newContact.name},</p><p>Thank you for reaching out to Gayatri Vidya Parishad Alumni. We have received your message and will get back to you soon.</p><p><strong>Your message:</strong><br/>${newContact.message.replace(/\n/g, '<br/>')}</p><p>Regards,<br/>GVP Alumni Team</p>`
        })
      ]);

      return res.status(201).json({
        success: true,
        data: newContact,
        message: 'Contact submitted (saved to local fallback storage)'
      });
    } catch (fsErr) {
      console.error('Fallback storage failed:', fsErr.message);
      return res.status(500).json({
        success: false,
        message: 'Error submitting contact',
        error: error.message
      });
    }
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact,
      message: 'Contact updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};

// Delete contact (soft delete by setting isActive to false)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};

// Hard delete contact
exports.hardDeleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact permanently deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};
