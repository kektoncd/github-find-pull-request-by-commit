# GitHub find pull request by commit

> Fetch pull request info by commit sha

## Usage

### Example

```yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: ci
  namespace: default
spec:
  tasks:
    - name: find-pull-request
      taskRef:
        name: github-find-pull-request-by-commit
        kind: ClusterTask # You can comment out if you are using this task as task not cluster task
      params: ....
```

### Params

## Installation

### As `ClusterTask`

```console
$ kubectl apply -f https://raw.githubusercontent.com/kektoncd/github-find-pull-request-by-commit/main/manifests/cluster-task.yml
```

### As `Task`

```console
$ kubectl apply -f https://raw.githubusercontent.com/kektoncd/github-find-pull-request-by-commit/main/manifests/task.yml
```

## Permission


GitHub token will need `pull_request:read` permission.

## License

See [LICENSE](./LICENSE) for details.
