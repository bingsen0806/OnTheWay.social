import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface Faq {
  question: string;
  answer: string;
}

interface FaqState {
  faqs: Faq[];
}

const faqs: Faq[] = [
  {
    question: 'How does OnTheWay work?',
    answer:
      "It's simple! Create an account, browse the available sessions to find someone to study with. If none of the sessions fit your schedule, create a new post and wait for others to apply!",
  },
  {
    question: 'What makes OnTheWay different?',
    answer:
      "Being in NUS is not easy. Studying can take up a large amount of time. That doesn't mean we cant socialize! We focus on making friends while studying! OnTheWay designs our feature such that users only use it for the intention of meeting up and studying together - not tomorrow, not next week, but right now (or the near future)",
  },
  {
    question: 'How does OnTheWay ensure a safe environment?',
    answer:
      'First, contact details are not shared until both parties accept to study together. Second, only verified NUS members can register on our platform',
  },
  {
    question: 'Why do you need NUS email address for signing up?',
    answer:
      'We require NUS email addresses to ensure everyone is a member of the NUS community',
  },
  {
    question: 'What happens after I apply for a session?',
    answer:
      "The poster will be notified and if the poster accepts, you will be notified. Both parties will receive each other's telegram handles to handle logistics.",
  },
  {
    question: 'Do you have a mobile app?',
    answer:
      "Currently, no, but you can bookmark this app on your home page for convenient access. To do so, google 'How to bookmark website on <your browser> <your operating system>', e.g. 'How to bookmark website on Chrome on Android'",
  },
  {
    question: 'I have feedback or questions, who do I reach out to?',
    answer: 'You can fill in our feedback form ',
  },
];

const initialState: FaqState = {
  faqs,
};

const FaqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    updateFaqs(state) {
      state.faqs = faqs;
    },
  },
});

// set up persistence, uses local storage to persist this reducer
const faqPersistConfig = {
  key: 'faq',
  storage,
};

const persistedFaqReducer = persistReducer(faqPersistConfig, FaqSlice.reducer);

export default persistedFaqReducer;

export const { updateFaqs } = FaqSlice.actions;
