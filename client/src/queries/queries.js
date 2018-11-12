import { gql } from 'apollo-boost';

const getReadingLogQuery = gql`
  query getReadingLogQuery($userName: String!) {
    user(userName: $userName) {
      id
      userName
      roleName
      books {
        id
        title
        author
        pagesRead
        pageCount
        publisher
        href
        googleBookId
        userId
        review
        multiplier
        redeemedPoints
        imageLink
        createdDt
        redeemedDt
        approved
        approvedDt
      }
    }
  }
`;


const getReviewReadyItems = gql`
  query getReviewReadyItems($readerId: String, $showAll: Boolean) {
    getReviewReadyItems(readerId: $readerId, showAll: $showAll) {
      id
      title
      author
      pagesRead
      pageCount
      publisher
      href
      googleBookId
      userId
      review
      multiplier
      redeemedPoints
      imageLink
      createdDt
      redeemedDt
      approved
      approvedDt
      used
      usedDt
    }
  }
`;

const getRedeemedBooksQuery = gql`
query getRedeemedBooksQuery($userName: String!) {
  getRedeemedBooksQuery(userName: $userName) {
    id
    title
    author
    pagesRead
    pageCount
    publisher
    href
    googleBookId
    userId
    redeemed
    review
    multiplier
    redeemedPoints
    imageLink
    createdDt
    redeemedDt
    approved
    approvedDt
  }
}
`;

const getContributionList = gql`
query getContributionList($userName: String!) {
  getContributionList(userName: $userName) {
    id
    title
    userId
    redeemed
    multiplier
    points
    redeemedPoints
    createdDt
    redeemedDt
  }
}
`;

const getRedeemedContributionList = gql`
query getRedeemedContributionList($userName: String!) {
  getRedeemedContributionList(userName: $userName) {
    id
    title
    userId
    redeemed
    multiplier
    redeemedPoints
    createdDt
    redeemedDt
  }
}
`;

const getUser = gql`
query getUser($userName: String) {
  user(userName: $userName) {
    id
    name
    userName
    roleName
    familyGroupId
  }
}
`;

const getReaders = gql`
query getReaders($familyGroupId: String!) {
  getReaders(familyGroupId: $familyGroupId) {
    id
    name
    userName
  }
}
`;

const getBookReview = gql`
query getBookReview($bookId: ID!) {
  getBookReview(bookId: $bookId) {
    review
  }
}
`;

const removeBookFromMyReadingLog = gql`
mutation removeBookFromMyReadingLog($bookId: ID!) {
  removeBookFromMyReadingLog(bookId: $bookId) {
    id
  }
}
`;

const updateMultiplier = gql`
mutation updateMultiplier($bookId: ID!, $multiplier: Int!) {
  updateMultiplier(bookId: $bookId, multiplier: $multiplier) {
    id
    multiplier
  }
}
`;

const updatePagesRead = gql`
mutation updatePagesRead($bookId: ID!, $pagesRead: Int!, $familyGroupid: String!) {
  updatePagesRead(bookId: $bookId, pagesRead: $pagesRead, familyGroupId: $familyGroupId) {
    id
    pagesRead
  }
}
`;

const redeemBookRead = gql`
mutation redeemBookRead($bookId: ID!, $redeemed: Boolean!, $redeemedPoints: Int!) {
  redeemBookRead(bookId: $bookId, redeemed: $redeemed, redeemedPoints: $redeemedPoints) {
    id
    redeemed
    redeemedPoints
  }
}
`;

const undoRedeemBookRead = gql`
mutation undoRedeemBookRead($bookId: ID!, $redeemed: Boolean!) {
  undoRedeemBookRead(bookId: $bookId, redeemed: $redeemed) {
    id
    redeemed
  }
}
`;

const saveReview = gql`
mutation saveReview($bookId: ID!, $review: String!) {
  saveReview(bookId: $bookId, review: $review) {
    id
  }
}
`;

const addReadingLogMutation = gql`
mutation addReadingLogMutation($title: String!, $author: String!, $pagesRead: Int!, $pageCount: Int!, $publisher: String!, $href: String!,
  $googleBookId: String!, $userId: String!, $redeemed: Boolean!, $review: String!, $multiplier: Float!, $redeemedPoints: Int!, $imageLink: String,
  $createdDt: String, $redeemedDt: String, $approved: Boolean, $approvedDt: String) {
  addReadingLogMutation(title: $title, author: $author, pagesRead: $pagesRead, pageCount: $pageCount, publisher: $publisher, href: $href,
    googleBookId: $googleBookId, userId: $userId, redeemed: $redeemed, review: $review, multiplier: $multiplier, redeemedPoints: $redeemedPoints,
    imageLink: $imageLink, createdDt: $createdDt, redeemedDt: $redeemedDt, approved: $approved, approvedDt: $approvedDt) {
    id
    title
    author
    pagesRead
    pageCount
    publisher
    href
    googleBookId
    userId
    redeemed
    review
    multiplier
    redeemedPoints
    imageLink
    createdDt
    redeemedDt
    approved
    approvedDt
  }
}
`;

const getUsedTimeFromBooks = gql`
query getUsedTimeFromBooks($userName: String!) {
  getUsedTimeFromBooks(userName: $userName) {
    id
    title
    author
    pagesRead
    pageCount
    publisher
    href
    googleBookId
    userId
    review
    multiplier
    redeemedPoints
    imageLink
    createdDt
    redeemedDt
    used
    usedDt
    approved
    approvedDt
  }
}

`;

const getUsedTimeFromContributions = gql`
query getUsedTimeFromContributions($userName: String!) {
  getUsedTimeFromContributions(userName: $userName) {
    id
    title
    userId
    redeemed
    points
    multiplier
    redeemedPoints
    createdDt
    redeemedDt
    used
    usedDt
  }
}
`;

const getUsedTimeFromContributionsById = gql`
query getUsedTimeFromContributionsById($readerId: String!) {
  getUsedTimeFromContributionsById(readerId: $readerId) {
    id
    title
    userId
    redeemed
    multiplier
    redeemedPoints
    createdDt
    redeemedDt
    used
    usedDt
  }
}
`;


const deleteTaskMutation = gql`
mutation deleteTaskMutation($taskId: ID!) {
  deleteTaskMutation(taskId: $taskId) {
    id
  }
}
`;


const removeContributionFromList = gql`
mutation removeContributionFromList($contributionId: ID!) {
  removeContributionFromList(contributionId: $contributionId) {
    id
  }
}
`;

const updateContributionMultiplier = gql`
mutation updateContributionMultiplier($contributionId: ID!, $multiplier: Int!) {
  updateContributionMultiplier(contributionId: $contributionId, multiplier: $multiplier) {
    id
    multiplier
  }
}
`;

const redeemContribution = gql`
mutation redeemContribution($contributionId: ID!, $redeemedPoints: Int!) {
  redeemContribution(contributionId: $contributionId, redeemedPoints: $redeemedPoints) {
    id
    redeemed
    redeemedPoints
  }
}
`;

const approveBookRead = gql`
mutation approveBookRead($bookId: ID!) {
  approveBookRead(bookId: $bookId) {
    id
    redeemed
    redeemedPoints
  }
}
`;

const useRedeemedBookTime = gql`
mutation useRedeemedBookTime($bookId: ID!) {
  useRedeemedBookTime(bookId: $bookId) {
    id
    redeemed
  }
}
`;

const useRedeemedContributionTime = gql`
mutation useRedeemedContributionTime($contributionId: ID!) {
  useRedeemedContributionTime(contributionId: $contributionId) {
    id
    redeemed
  }
}
`;

const undoRedeemContribution = gql`
mutation undoRedeemContribution($contributionId: ID!) {
  undoRedeemContribution(contributionId: $contributionId) {
    id
    redeemed
  }
}
`;

const addContributionMutation = gql`
mutation addContributionMutation($title: String!, $userId: String!, $multiplier: Int!, $points: Int!, $redeemedPoints: Int!, $taskId: String!) {
  addContributionMutation(title: $title, userId: $userId, multiplier: $multiplier, points: $points, redeemedPoints: $redeemedPoints, taskId: $taskId) {
    id
    title
    userId
    redeemed
    multiplier
    points
    redeemedPoints
    createdDt
    redeemedDt
  }
}
`;

const addTaskMutation = gql`
mutation addTaskMutation($taskName: String!, $points: Int!, $userId: String!, $ageGroupId: String, $familyGroupId: String) {
  addTaskMutation(taskName: $taskName, points: $points, userId: $userId, ageGroupId: $ageGroupId, familyGroupId: $familyGroupId) {
    id
    taskName
    points
    isActive
    createdById
    createdDt
    ageGroupId
  }
}
`;

const addUserMutation = gql`
mutation addUserMutation($name: String!, $userName: String!, $roleName: String!, $dob: String, $familyGroupId: String ) {
  addUserMutation(name: $name, userName: $userName, roleName: $roleName, dob: $dob, familyGroupId: $familyGroupId) {
    id
    name
    userName
    roleName
    dob
    familyGroupId
  }
}
`;

const addFamilyGroupMutation = gql`
mutation addFamilyGroupMutation($name: String!, $lastName: String!, $address: String!, $contactNumber: String) {
  addFamilyGroupMutation(name: $name, lastName: $lastName, address: $address, contactNumber: $contactNumber) {
    id
    name
    lastName
    address
    contactNumber
  }
}
`;

const deactivateTask = gql`
mutation deactivateTask($taskId: ID!, $userId: String!) {
  deactivateTask(taskId: $taskId, userId: $userId) {
    id
    isActive
  }
}
`;

const activateTask = gql`
mutation activateTask($taskId: ID!, $userId: String!) {
  activateTask(taskId: $taskId, userId: $userId) {
    id
    isActive
  }
}
`;

const getActiveTasksQuery = gql`
query getActiveTasksQuery($userName : String!, $familyGroupId: String) {
  getActiveTasksQuery(userName: $userName, familyGroupId: $familyGroupId) {
    id
    taskName
    points
    isActive
    createdById
    createdDt
    ageGroupId
  }
}
`;

const getInActiveTasksQuery = gql`
query getInActiveTasksQuery {
  getInActiveTasksQuery {
    id
    taskName
    points
    isActive
    createdById
    createdDt
  }
}
`;

const getTaskQuery = gql`
query getTaskQuery($taskId: ID!) {
  getTaskQuery(taskId: $taskId) {
    id
    taskName
    points
    isActive
    createdById
    createdDt
  }
}
`;

const getAgeGroups = gql`
query getAgeGroups {
  ageGroups {
    id
    name
    beginAge
    endAge
    createdDt
  }
}
`;

const getFamilyGroups = gql`
query getFamilyGroups {
  familyGroups {
    id
    name
    lastName
    address
    contactNumber
  }
}
`;

const getUserList = gql`
query getUserList {  
  users {
    id
    name
    userName
    roleName
    dob
    familyGroup {
      id
      name
      lastName
      address
    }
    ageGroups {
      name
      beginAge
      endAge
    }
  }
}
`;

export {
  getUser, getReadingLogQuery, addReadingLogMutation, updatePagesRead, removeBookFromMyReadingLog,
  redeemBookRead, getRedeemedBooksQuery, saveReview, getBookReview, updateMultiplier, undoRedeemBookRead,
  removeContributionFromList, updateContributionMultiplier, redeemContribution, undoRedeemContribution, addContributionMutation,
  addTaskMutation, getActiveTasksQuery, getInActiveTasksQuery, activateTask, deactivateTask, getTaskQuery,
  getContributionList, getRedeemedContributionList, deleteTaskMutation, useRedeemedBookTime, useRedeemedContributionTime,
  getUsedTimeFromContributions, getUsedTimeFromBooks, approveBookRead, getReviewReadyItems, getReaders, getUsedTimeFromContributionsById,
  getAgeGroups, getFamilyGroups, getUserList, addUserMutation, addFamilyGroupMutation
};