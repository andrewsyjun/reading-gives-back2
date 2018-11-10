const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const User = require('../models/user');
const Task = require('../models/task');
const AgeGroup = require('../models/agegroup');
const FamilyGroup = require('../models/familygroup');
const Contribution = require('../models/contribution');
const EmailSender = require('../notification/EmailSender');
const { ObjectId } = require('mongodb');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLDate, GraphQLBoolean,
  GraphQLFloat, GraphQLNonNull } = graphql;


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
    pagesRead: { type: GraphQLInt },
    pageCount: { type: GraphQLInt },
    publisher: { type: GraphQLString },
    href: { type: GraphQLString },
    googleBookId: { type: GraphQLString },
    userId: { type: GraphQLString },
    redeemed: { type: GraphQLBoolean },
    review: { type: GraphQLString },
    multiplier: { type: GraphQLFloat },
    redeemedPoints: { type: GraphQLInt },
    imageLink: { type: GraphQLString },
    createdDt: { type: GraphQLString },
    redeemedDt: { type: GraphQLString },
    used: { type: GraphQLBoolean },
    usedDt: { type: GraphQLString },
    approved: { type: GraphQLBoolean },
    approvedDt: { type: GraphQLString }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    userName: { type: GraphQLString },
    roleName: { type: GraphQLString },
    bod: { type: GraphQLString },
    familyGroupId: { type: GraphQLString },
    familyGroup: {
      type: new GraphQLList(FamilyGroupType),
      resolve(parent, args) {
        return FamilyGroup.find({ _id: parent.familyGroupId })
      }
    },
    ageGroups: {
      type: new GraphQLList(AgeGroupType),
      resolve(parent, args) {
        let age = new Date().getYear() - new Date(parent.bod).getYear();
        return AgeGroup.find({
          $or: [
            {
              $and: [{ beginAge: { $lte: age } },
              { endAge: { $gte: age } }]
            },
            { $and: [{ beginAge: { $eq: -1 } }, { endAge: { $eq: -1 } }] }
          ]
        })
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ userId: parent.id, redeemed: false });
      }
    },
    contributions: {
      type: new GraphQLList(ContributionType),
      resolve(parent, args) {
        return Contribution.find({ userId: parent.id, redeemed: false })
      }
    }
  })
});

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    taskName: { type: GraphQLString },
    points: { type: GraphQLInt },
    isActive: { type: GraphQLBoolean },
    createdById: { type: GraphQLString },
    createdDt: { type: GraphQLString },
    ageGroupId: { type: GraphQLString },
    contributions: {
      type: new GraphQLList(ContributionType),
      resolve(parent, args) {
        return Contribution.find({ title: parent.taskName })
      }
    },
    ageGroups: {
      type: new GraphQLList(AgeGroupType),
      resolve(parent, args) {
        return AgeGroup.find({ _id: parent.ageGroupId })
      }
    }
  })
})

const ContributionType = new GraphQLObjectType({
  name: 'Contribution',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    taskId: { type: GraphQLString },
    userId: { type: GraphQLString },
    redeemed: { type: GraphQLBoolean },
    multiplier: { type: GraphQLFloat },
    points: { type: GraphQLInt },
    redeemedPoints: { type: GraphQLInt },
    createdDt: { type: GraphQLString },
    redeemedDt: { type: GraphQLString },
    used: { type: GraphQLBoolean },
    usedDt: { type: GraphQLString }
  })
})

const RoleType = new GraphQLObjectType({
  name: 'Role',
  fields: () => ({
    id: { type: GraphQLID },
    roleName: { type: GraphQLString }
  })
});

const AgeGroupType = new GraphQLObjectType({
  name: 'AgeGroup',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    beginAge: { type: GraphQLInt },
    endAge: { type: GraphQLInt },
    createdDt: { type: GraphQLString }
  })
});

const FamilyGroupType = new GraphQLObjectType({
  name: 'FamilyGroup',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    lastName: { type: GraphQLString },
    address: { type: GraphQLString },
    contactNumber: { type: GraphQLString },
    createdDt: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { bookId: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get matching data from db
        return Book.findById(args.bookId);
      }
    },
    user: {
      type: UserType,
      args: { userName: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findOne({ userName: args.userName });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      }

    },
    task: {
      type: TaskType,
      args: { taskId: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get matching data from db
        return Task.findById(args.taskId);
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({});
      }

    },
    ageGroup: {
      type: AgeGroupType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return AgeGroup.findById(args.id);
      }
    },
    ageGroup: {
      type: AgeGroupType,
      args: { ageGroupId: { type: GraphQLString } },
      resolve(parent, args) {
        return AgeGroup.findById(args.ageGroupId)
      }
    },
    ageGroups: {
      type: new GraphQLList(AgeGroupType),
      resolve(parent, args) {
        return AgeGroup.find({}).sort({ name: 1 });
      }
    },
    familyGroup: {
      type: FamilyGroupType,
      args: { name: { type: GraphQLString } },
      resolve(parent, args) {
        return FamilyGroup.findOne({ name: args.name });
      }
    },
    familyGroups: {
      type: new GraphQLList(FamilyGroupType),
      resolve(parent, args) {
        return FamilyGroup.find({});
      }
    },
    getTaskQuery: {
      type: TaskType,
      args: { taskId: { type: GraphQLID } },
      resolve(parent, args) {
        return Task.findById(args.taskId);
      }
    },
    getActiveTasksQuery: {
      type: new GraphQLList(TaskType),
      args: {
        userName: { type: GraphQLString },
        familyGroupId: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log("in getActiveTasksQuery");
        return User.findOne({ userName: args.userName })
          .then(function (res) {
            let role = res.roleName;
            console.log("getActiveTasksQuery: role = " + role);
            if (role.split(",").includes("Parent")) {
              return Task.find({ isActive: true, familyGroupId: args.familyGroupId });
            } else {
              let bodYear = new Date(res.bod).getYear();
              let currYear = new Date().getYear();
              let age = currYear - bodYear;
              return AgeGroup.find({
                $or: [
                  { $and: [{ beginAge: { $lte: age } }, { endAge: { $gte: age } }] },
                  { $and: [{ beginAge: { $eq: -1 } }, { endAge: { $eq: -1 } }] }
                ]
              })
                .then(function (res2) {
                  let ids = res2.map(group => group._id);
                  return Task.find({ ageGroupId: { $in: ids }, familyGroupId: args.familyGroupId });
                })
            }
          })
      }
    },
    getInactiveTasksQuery: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({ isActive: false });
      }

    },
    contribution: {
      type: ContributionType,
      args: { contributionId: { type: GraphQLID } },
      resolve(parent, args) {
        return Contribution.findById(args.contributionId);
      }
    },
    getReadingLogQuery: {
      type: new GraphQLList(UserType),
      aregs: {
        userName: new GraphQLNonNull(GraphQLString)
      }, resolve(parent, args) {
        return User.findOne({ userName: args.userName });
      }

    },
    getReviewReadyItems: {
      type: new GraphQLList(BookType),
      args: {
        readerId: { type: GraphQLString },
        showAll: { type: GraphQLBoolean }
      },
      resolve(parent, args) {
        //code to get matching data from db
        if (args.showAll) {
          return Book.find({ userId: args.readerId });
        } else {
          return Book.find({ userId: args.readerId, approved: false });
        }
      }
    },
    getReaders: {
      type: new GraphQLList(UserType),
      args: {
        familyGroupId: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log("getReaders: familyGroupId = " + args.familyGroupId);
        return User.find({ familyGroupId: args.familyGroupId });
      }
    },
    getRedeemedBooksQuery: {
      type: new GraphQLList(BookType),
      args: {
        userName: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return User.findOne({ userName: args.userName })
          .then(function (res) {
            return Book.find({ userId: res.id, redeemed: true, used: false }).sort({ redeemedDt: -1 });
          })
      }
    },
    getBooks: {
      type: new GraphQLList(BookType),
      args: { userId: { type: GraphQLString } },
      resolve(parent, args) {
        //code to get matching data from db
        return Book.find({ userId: args.userId });
      }
    },
    getBookReview: {
      type: BookType,
      args: {
        bookId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Book.findOne({ id: args.bookId })
      }
    },
    getContributionList: {
      type: new GraphQLList(ContributionType),
      args: { userName: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findOne({ userName: args.userName })
          .then(function (res) {
            return Contribution.find({ userId: res.id, redeemed: false, used: false });
          })
      }
    },
    getRedeemedContributionList: {
      type: new GraphQLList(ContributionType),
      args: {
        userName: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return User.findOne({ userName: args.userName })
          .then(function (res) {
            return Contribution.find({ userId: res.id, redeemed: true, used: false }).sort({ createdDt: 1 });
          })
      }
    },
    getContributions: {
      type: new GraphQLList(ContributionType),
      args: { userId: { type: GraphQLString } },
      resolve(parent, args) {
        //code to get matching data from db
        return Contribution.find({ userId: args.userId });
      }

    },
    getUsedTimeFromContributions: {
      type: new GraphQLList(ContributionType),
      args: { userName: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findOne({ userName: args.userName })
          .then(function (res) {
            return Contribution.find({ userId: res.id, used: true }).sort({ createdDt: 1 });
          })
      }

    },
    getUsedTimeFromContributionsById: {
      type: new GraphQLList(ContributionType),
      args: { readerId: { type: GraphQLString } },
      resolve(parent, args) {
        return Contribution.find({
          userId: args.readerId, "$or": [{ redeemed: true },
          { used: true }]
        }).sort({ createdDt: 1 });
      }

    },
    getUsedTimeFromBooks: {
      type: new GraphQLList(BookType),
      args: { userName: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findOne({ userName: args.userName })
          .then(function (res) {
            return Book.find({ userId: res.id, used: true }).sort({ createdDt: 1 });
          })
      }

    }
  }
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUserMutation: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        userName: { type: GraphQLString },
        roleName: { type: GraphQLString },
        bod: { type: GraphQLString },
        familyGroupId: { type: GraphQLString }
      },
      resolve(parent, args) {
        let roles = [];
        roles.push(args.roleName);
        let user = new User({
          name: args.name,
          userName: args.userName,
          roleName: roles,
          bod: args.bod,
          familyGroupId: args.familyGroupId,
          createdDt: new Date()
        });
        return user.save();
      }
    },
    addAgeGroup: {
      type: AgeGroupType,
      args: {
        name: { type: GraphQLString },
        beginAge: { type: GraphQLInt },
        endAge: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let ageGroup = new AgeGroup({
          name: args.name,
          beginAge: args.beginAge,
          endAge: args.endAge,
          createdDt: new Date()
        });
        return ageGroup.save();
      }
    },
    addFamilyGroupMutation: {
      type: FamilyGroupType,
      args: {
        name: { type: GraphQLString },
        lastName: { type: GraphQLString },
        address: { type: GraphQLString },
        contactNumber: { type: GraphQLString }
      },
      resolve(parent, args) {
        let familyGroup = new FamilyGroup({
          name: args.name,
          lastName: args.lastName,
          address: args.address,
          contactNumber: args.contactNumber,
          createdDt: new Date()
        });
        return familyGroup.save();
      }
    },
    addTaskMutation: {
      type: TaskType,
      args: {
        taskName: { type: new GraphQLNonNull(GraphQLString) },
        points: { type: GraphQLInt },
        userId: { type: GraphQLString },
        ageGroupId: { type: GraphQLString },
        familyGroupId: { type: GraphQLString }
      },
      resolve(parent, args) {
        let task = new Task({
          taskName: args.taskName,
          points: args.points,
          isActive: true,
          createdById: args.userId,
          createdDt: new Date(),
          ageGroupId: args.ageGroupId,
          familyGroupId: args.familyGroupId
        });
        return task.save();
      }
    },
    deleteTaskMutation: {
      type: TaskType,
      args: { taskId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Task.findByIdAndRemove(args.taskId);
      }
    },
    addRole: {
      type: RoleType,
      args: {
        roleName: { type: GraphQLString }
      },
      resolve(parent, args) {
        let role = new Role({
          roleName: args.roleName
        });
        return role.save();
      }
    },
    addReadingLogMutation: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: GraphQLString },
        pagesRead: { type: GraphQLInt },
        pageCount: { type: GraphQLInt },
        publisher: { type: GraphQLString },
        href: { type: GraphQLString },
        googleBookId: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        redeemed: { type: GraphQLBoolean },
        review: { type: GraphQLString },
        multiplier: { type: GraphQLFloat },
        redeemedPoints: { type: GraphQLInt },
        imageLink: { type: GraphQLString },
        createdDt: { type: GraphQLString },
        redeemedDt: { type: GraphQLString },
        used: { type: GraphQLBoolean },
        usedDt: { type: GraphQLString },
        approved: { type: GraphQLBoolean },
        approvedDt: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Book.findOne({ googleBookId: args.googleBookId }, function (err, result) {
          if (err) {
            return new Error("Error thrown when trying to add the book to the log " + args.title);
          } else {
            if (result) {
              return "The book is already in your log. It was added on " + new Date(result.createdDt).toDateString() + ". Check to see if you are adding the correct book.";
            } else {
              let book = new Book({
                title: args.title,
                author: args.author,
                pagesRead: args.pagesRead,
                pageCount: args.pageCount,
                publisher: args.publisher,
                href: args.href,
                googleBookId: args.googleBookId,
                userId: args.userId,
                redeemed: args.redeemed,
                review: args.review,
                multiplier: args.multiplier,
                redeemedPoints: args.redeemedPoints,
                imageLink: args.imageLink,
                createdDt: new Date(),
                redemeedDt: null,
                used: false,
                usedDt: null,
                approved: false,
                approvedDt: null
              });
              return book.save();
            }
          }
        })

      }
    },
    removeBookFromMyReadingLog: {
      type: BookType,
      args: { bookId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Book.findByIdAndRemove(args.bookId);
      }
    },
    updateMultiplier: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) },
        multiplier: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.bookId, { $set: { multiplier: args.multiplier } })
          .then(multiplier => Book.findById(args.bookId).exec())
          .catch(err => new Error('Failed to update multiplier ' + err));
      }
    },
    updatePagesRead: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) },
        pagesRead: { type: new GraphQLNonNull(GraphQLInt) },
        familyGroupId: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.bookId, { $set: { pagesRead: args.pagesRead } },
          function (err, res) {
            if (err) throw err;
            if (args.pagesRead === res.pageCount) {
              User.findById(res.userId,
                function (err2, res2) {
                  User.find({ roleName: "Parent", familyGroupId: args.familyGroupId }, function (err3, res3) {
                    let emailer = new EmailSender();
                    emailer.sendApprovalRequestEmail(res2.name, res3);
                  })
                })

            }

          })
          .then(pagesRead => Book.findById(args.bookId).exec())
          .catch(err => new Error('Failed to update pages read ' + err));
      }
    },
    redeemBookRead: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) },
        redeemed: { type: new GraphQLNonNull(GraphQLBoolean) },
        redeemedPoints: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.bookId, { $set: { redeemed: args.redeemed, redeemedPoints: args.redeemedPoints, redeemedDt: new Date() } })
          .then(redeemed => Book.findById(args.bookId).exec())
          .catch(err => new Error('Failed to redeem book ' + err));
      }
    },
    approveBookRead: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.bookId, { $set: { approved: true, approvedDt: new Date() } },
          function (err, res) {
            if (err) throw err;
            User.findById(res.userId,
              function (err2, res2) {
                let emailer = new EmailSender();
                emailer.sendApprovalEmail(res2.name, res2.userName);
              })
          }
        )
          .then(redeemed => Book.findById(args.bookId).exec())
          .catch(err => new Error('Failed to redeem book ' + err));
      }
    },
    undoRedeemBookRead: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) },
        redeemed: { type: new GraphQLNonNull(GraphQLBoolean) }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.bookId, { $set: { redeemed: args.redeemed, redeemedDt: null } })
          .then(redeemed => Book.findById(args.bookId).exec())
          .catch(err => new Error('Failed to undo redeemed book ' + err));
      }
    },
    saveReview: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) },
        review: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.bookId, { $set: { review: args.review } });
      }
    },
    addContributionMutation: {
      type: ContributionType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        multiplier: { type: GraphQLInt },
        points: { type: GraphQLInt },
        redeemedPoints: { type: GraphQLInt },
        taskId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let contribution = new Contribution({
          title: args.title,
          userId: args.userId,
          redeemed: false,
          multiplier: args.multiplier,
          points: args.points,
          redeemedPoints: args.redeemedPoints,
          createdDt: new Date(),
          redemeedDt: null,
          used: false,
          usedDt: null
        });
        return contribution.save();

      }
    },
    updateContributionMultiplier: {
      type: ContributionType,
      args: {
        contributionId: { type: new GraphQLNonNull(GraphQLID) },
        multiplier: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return Contribution.findByIdAndUpdate(args.contributionId, { $set: { multiplier: args.multiplier } })
          .then(multiplier => Book.findById(args.contributionId).exec())
          .catch(err => new Error('Failed to update contribution multiplier ' + err));
      }
    },
    removeContributionFromList: {
      type: ContributionType,
      args: {
        contributionId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Contribution.findByIdAndDelete(args.contributionId)
          .catch(err => new Error('Failed to update delete contribution ' + err));
      }
    },
    redeemContribution: {
      type: ContributionType,
      args: {
        contributionId: { type: new GraphQLNonNull(GraphQLID) },
        redeemedPoints: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return Contribution.findByIdAndUpdate(args.contributionId, { $set: { redeemed: true, redeemedPoints: args.redeemedPoints, redeemedDt: new Date() } })
          .then(redeemed => Contribution.findById(args.contributionId).exec())
          .catch(err => new Error('Failed to redeem contribution ' + err));
      }
    },
    undoRedeemContribution: {
      type: ContributionType,
      args: {
        contributionId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Contribution.findByIdAndUpdate(args.contributionId, { $set: { redeemed: false, redeemedDt: null } })
          .then(redeemed => Contribution.findById(args.contributionId).exec())
          .catch(err => new Error('Failed to undo contribution from redeemed list' + err));
      }
    },
    useRedeemedBookTime: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.bookId, { $set: { used: true, usedDt: new Date() } })
          .then(redeemed => Book.findById(args.bookId).exec())
          .catch(err => new Error('Failed to use redeemed book time ' + err));
      }
    },
    undoUsedBookTime: {
      type: BookType,
      args: {
        bookId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.bookId, { $set: { used: false, redeemedDt: null } })
          .then(redeemed => Book.findById(args.bookId).exec())
          .catch(err => new Error('Failed to undo used book time ' + err));
      }
    },
    useRedeemedContributionTime: {
      type: ContributionType,
      args: {
        contributionId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Contribution.findByIdAndUpdate(args.contributionId, { $set: { used: true, usedDt: new Date() } })
          .then(redeemed => Contribution.findById(args.contributionId).exec())
          .catch(err => new Error('Failed to redeem contribution ' + err));
      }
    },
    undoUsedContributionTime: {
      type: ContributionType,
      args: {
        contributionId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Contribution.findByIdAndUpdate(args.contributionId, { $set: { used: false, redeemedDt: null } })
          .then(redeemed => Contribution.findById(args.contributionId).exec())
          .catch(err => new Error('Failed to undo used contribution time ' + err));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})