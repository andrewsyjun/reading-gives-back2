const nodemailer = require('nodemailer');


const email = ({
  fromAddress: "readinggivesback@gmail.com"
});


class EmailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'readinggivesback@gmail.com',
        pass: 'Familybae4me!!'
      }
    });
  }

  sendApprovalRequestEmail(name, res) {
    let arr = [...res];
    let toAddress = "";
    arr.forEach(function (user, index) {
      toAddress += user.userName;
      if ((index + 1) < arr.length) {
        toAddress += ", ";
      }
    })

    let mailOptions = {
      from: email.fromAddress,
      to: toAddress,
      subject: "Request for approval is waiting for you",
      text: name + " is requesting approval for the completed books. You can login to www.readinggivesback.com to review the reqeust and give approval."
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }


  sendApprovalEmail(name, toAddress) {
    var mailOptions = {
      from: email.fromAddress,
      to: toAddress,
      subject: "You book(s) has been approved",
      text: "Great job, " + name + "! Please login to the site (www.readinggivesback.com) to redeem your points."
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
}

module.exports = EmailSender;