import Matrix from 'ml-matrix';
import Tree from './TreeNode';

const defaultOptions = {
    gainFunction: 'regression',
    splitFunction: 'mean',
    minNumSamples: 3,
    maxDepth: Infinity
};

export default class DecisionTreeRegression {

    /**
     * Create new Decision Tree Regression with CART implementation with the given options.
     * @param {object} options
     * @param {string} [options.gainFunction="regression"] - gain function to get the best split, "regression" the only one supported.
     * @param {string} [options.splitFunction] - given two integers from a split feature, get the value to split, "mean" the only one supported.
     * @param {number} [options.minNumSamples] - minimum number of samples to create a leaf node to decide a class. Default 3.
     * @param {number} [options.maxDepth] - Max depth of the tree. Default Infinity.
     * @param {object} model - for load purposes.
     */
    constructor(options, model) {
        if (options === true) {
            this.options = model.options;
            this.root = new Tree(model.options);
            this.root.setNodeParameters(model.root);
        } else {
            this.options = Object.assign({}, defaultOptions, options);
            this.options.kind = 'regression';
        }
    }

    /**
     * Train the decision tree with the given training set and values.
     * @param {Matrix} trainingSet
     * @param {Array} trainingValues
     */
    train(trainingSet, trainingValues) {
        this.root = new Tree(this.options);
        if (trainingSet[0].length === undefined) trainingSet = Matrix.columnVector(trainingSet);
        if (!Matrix.isMatrix(trainingSet)) trainingSet = new Matrix(trainingSet);
        this.root.train(trainingSet, trainingValues, 0);
    }

    /**
     * Predicts the values given the matrix to predict.
     * @param {Matrix} toPredict
     * @return {Array} predictions
     */
    predict(toPredict) {
        if (toPredict[0].length === undefined) toPredict = Matrix.columnVector(toPredict);
        var predictions = new Array(toPredict.length);

        for (var i = 0; i < toPredict.length; ++i) {
            predictions[i] = this.root.classify(toPredict[i]);
        }

        return predictions;
    }

    /**
     * Export the current model to JSON.
     * @return {object} - Current model.
     */
    toJSON() {
        return {
            options: this.options,
            root: this.root,
            name: 'DTRegression'
        };
    }

    /**
     * Load a Decision tree regression with the given model.
     * @param {object} model
     * @return {DecisionTreeRegression}
     */
    static load(model) {
        if (model.name !== 'DTRegression') {
            throw new RangeError('Invalid model:' + model.name);
        }

        return new DecisionTreeRegression(true, model);
    }
}

module.exports = DecisionTreeRegression;
