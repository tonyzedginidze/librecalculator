export const messages = {
  "probability.operation.complement": "Not A",
  "probability.operation.independent-both": "A and B",
  "probability.operation.event-union": "A or B",
  "probability.field.first": "Probability of A",
  "probability.field.second": "Probability of B",
  "probability.field.intersection": "Probability of both A and B",
  "probability.working.complement": "P(not A) = 1 − {first} = {answer}",
  "probability.working.independent-both":
    "P(A and B) = {first} × {second} = {answer}",
  "probability.working.event-union":
    "P(A or B) = {first} + {second} − {intersection} = {answer}",
  "probability.result": "Result",
  "probability.error.invalid-field": "Enter a number in every field.",
  "probability.error.invalid-domain":
    "Probabilities must be between 0 and 1, and the overlap can be no larger than A or B and no smaller than A + B − 1.",
  "probability.error.output-overflow":
    "The result is outside the supported range.",
  "probability.visual.event": "A happens",
  "probability.visual.not-event": "A does not happen",
  "probability.visual.total": "All outcomes",
  "probability.visual.caption.complement":
    "Every outcome is either A or not A, so the two parts add up to 1",
  "probability.visual.summary.complement":
    "A bar of total 1 split into {first} for A and {answer} for not A.",
  "probability.visual.caption.independent-both":
    "With independent events, A and B overlap in the product of their areas",
  "probability.visual.summary.independent-both":
    "A unit square with A covering {first} of its width and B covering {second} of its height; the overlap is {answer}.",
  "probability.visual.caption.event-union":
    "A or B covers everything inside either circle, counting the overlap once",
  "probability.visual.summary.event-union":
    "A only {aOnly}, both {both}, B only {bOnly}; together A or B is {answer}, and neither is {neither}.",
  "probability.visual.a": "A",
  "probability.visual.b": "B",
  "probability.visual.both": "Both",
  "probability.visual.a-only": "A only",
  "probability.visual.b-only": "B only",
  "probability.visual.neither": "Neither",
  "probability.visual.note.independent-both":
    "Areas are drawn to scale. The overlap is A × B only when the events are independent.",
  "probability.visual.note.event-union":
    "Circles show the parts, not their sizes; the numbers are the probabilities of each part.",
  "probability.visual.description":
    "Each operation has its own picture: a bar split into A and not A, a unit square whose overlap is A × B, or two overlapping circles labelled with the probability of each part.",
  "probability.visual.alternative":
    "Every probability shown in the picture is also stated in text from the same calculation.",
  "lesson.probability.intro.title": "Using probabilities",
  "lesson.probability.intro.body":
    "A probability is a number from 0 (impossible) to 1 (certain). Combining two probabilities depends on how the events relate, so pick the operation that matches your situation.",
  "lesson.probability.meaning.title": "Which operation to choose",
  "lesson.probability.meaning.body":
    "Use Not A for the chance an event does not happen. Use A and B only when the events are independent, meaning one happening does not change the chance of the other. Use A or B when you also know the chance that both happen.",
  "lesson.probability.formula.complement": "P(not A) = 1 − P(A)",
  "lesson.probability.formula.independent-both": "P(A and B) = P(A) × P(B)",
  "lesson.probability.formula.event-union":
    "P(A or B) = P(A) + P(B) − P(A and B)",
  "lesson.probability.example.0": "The complement of a 1-in-5 chance",
  "lesson.probability.example.1": "Two independent events both happening",
  "lesson.probability.example.2": "Counting the overlap only once",
  "lesson.probability.mistakes.title": "Common mistakes",
  "lesson.probability.mistakes.body":
    "Adding two probabilities counts their overlap twice. Multiplying them gives the chance of both only under independence. A probability of 0.2 means 20%, not 0.2%. The calculator cannot tell whether your events are independent.",
  "lesson.probability.limits.title": "Limits and assumptions",
  "lesson.probability.limits.body":
    "All probabilities are decimals from 0 to 1. For A or B, the overlap must lie between max(0, A + B − 1) and min(A, B). No conditional probability, distributions, counting rules or uncertainty in the inputs. Inputs keep up to 30 significant digits and the calculation uses 50; only the displayed answer is rounded.",
  "lesson.probability.sources.title": "Sources",
  "lesson.probability.sources.body":
    "OpenStax Introductory Statistics 2e, probability topics: https://openstax.org/details/books/introductory-statistics-2e",
  "lesson.probability.faq.q":
    "Why can an overlap between 0 and 1 still be invalid?",
  "lesson.probability.faq.a":
    "The chance of both cannot exceed the chance of either one, and it must be large enough that A or B does not exceed 1. Both limits are checked.",
  "lesson.probability.variable.item1": "probability of event A",
  "lesson.probability.variable.item2": "probability of event B",
} as const;
