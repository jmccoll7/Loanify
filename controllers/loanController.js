import Loan from '../models/Loan.js';

const logError = (res, err) => {
  console.log(err);
  res.status(500).json({
    message: 'Error retrieving loan data',
    error: err,
  });
};

export const loanForm = async (req, res) => {
  res.render('loan', { pageTitle: 'Loan', errorDetails: {}, errorMessage: null });
};

export const loanInput = async (req, res) => {
  const { loan_type, loan_number, amount, interest_rate, loan_term, start_date } = req.body;
  const loan = new Loan({
    user_id: req.user._id,
    loan_type,
    loan_number,
    amount,
    interest_rate,
    loan_term,
    start_date,
  });
  await loan
    .save()
    .then((data) => {
      res.status(201).json({
        message: 'Loan created successfully',
        entries: data.length,
        data: data,
      });
      console.log('Loan created successfully', data);
    })
    .catch((err) => {
      console.log(err);
      res.status(422).render('loan', {
        pageTitle: 'Loan',
        errorMessage: 'Error creating loan. Please check your input.',
        errorDetails: err.errors,
      });
    });
};

export const getAllLoans = async (req, res) => {
  await Loan.find()
    .then((data) => {
      res.render('loanlist', { pageTitle: 'Loan List', data: data });
      console.log('Loan data retrieved successfully', data);
    })
    .catch((err) => {
      logError(res, err);
    });
};

export const getLoanById = async (req, res) => {
  const id = req.params.id;
  await Loan.findById(id)
    .then((data) => {
      res.status(200).json({
        status: 'Loan data retrieved successfully',
        data: data,
      });
      console.log('Loan data retrieved successfully', data);
    })
    .catch((err) => {
      logError(res, err);
    });
};

export const createLoan = async (req, res) => {
  await Loan.create(req.body)
    .then((data) => {
      res.status(201).json({
        message: 'Loan created successfully',
        entries: data.length,
        data: data,
      });
      console.log('Loan created successfully', data);
    })
    .catch((err) => {
      logError(res, err);
    });
};

export const updateLoan = async (req, res) => {
  const id = req.params.id;
  const updateKeys = Object.keys(req.body);
  await Loan.findById(id)
    .then((data) => {
      updateKeys.forEach((key) => {
        data[key] = req.body[key];
      });
      data.updated_date = Date.now();
      return data.save();
    })
    .then((data) => {
      res.status(200).json({
        message: 'Loan updated successfully',
        data: data,
      });
      console.log('Loan updated successfully', data);
    })
    .catch((err) => {
      logError(res, err);
    });
};

export const deleteLoan = async (req, res) => {
  const id = req.params.id;
  await Loan.deleteOne({ _id: id })
    .then((data) => {
      res.status(204).json({
        message: 'Loan deleted successfully',
        data: data,
      });
      console.log('Loan deleted successfully', data);
    })
    .catch((err) => {
      logError(res, err);
    });
};
