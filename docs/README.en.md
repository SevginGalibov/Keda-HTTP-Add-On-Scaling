# **Kubernetes KEDA HTTP Add-on Load Test and Auto-scaling Guide**

This guide explains how to perform load testing and auto-scaling using KEDA and HTTP Add-on in a Kubernetes environment. Follow the steps below to set up your environment and conduct tests.

---

## **Step 1: Create a Kubernetes Cluster (with Kind)**

Create a local Kubernetes cluster using Kind (Kubernetes in Docker) by running the following command:

```bash
kind create cluster --config kind-ingress-config.yaml
```

![Creating Cluster](https://kind.sigs.k8s.io/images/kind-create-cluster.png)

---

## **Step 2: Install NGINX Ingress Controller**

Install the NGINX Ingress Controller to manage ingress traffic:

```bash
kubectl apply --filename https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
```

Verify that the ingress controller has been installed successfully:

```bash
kubectl get pods -n ingress-nginx
```

![Ingress Controller Pods](https://imgur.com/7iJizRy.png)

---

## **Step 3: Install the KEDA Operator**

Install the KEDA operator using Helm:

```bash
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda --namespace keda --create-namespace
```

![KEDA Operator Installation](https://imgur.com/GzRPiTd.png)

---

## **Step 4: Install the KEDA HTTP Add-on**

Install the KEDA HTTP Add-on by running:

```bash
helm install http-add-on kedacore/keda-add-ons-http --namespace keda
```

Check that the HTTP Add-on components are running:

```bash
kubectl get pods -n keda
```

![HTTP Add-on Pods](https://imgur.com/pdyPIQw.png)

---

## **Step 5: Deploy Application and Services**

Deploy a test `Deployment`, `Service`, and `HTTPScaledObject` resources.

1. **Create a namespace:**
   ```bash
   kubectl create ns test
   ```

2. **Apply application and service resources:**
   ```bash
   kubectl apply -f nginx-app.yaml -n test
   kubectl apply -f external-proxy-service.yaml -n test
   kubectl apply -f httpscaleobject.yaml -n test
   ```

3. Verify that the resources have been successfully created:
   ```bash
   kubectl get all -n test
   ```

![Application and Service Deployment](https://i.imgur.com/LqINQjl.png)

---

## **Step 6: Perform Load Testing (with K6)**

To perform a load test using K6, create and save the following script (`k6-load.js`):

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 50,               // 50 virtual users concurrently
    duration: '600s',      // Test duration of 10 minutes
};

export default function () {
    const url = 'http://127.0.0.1';

    const params = {
        headers: {
            'Host': 'www.sevgin.com',
        },
    };

    http.get(url, params);
    sleep(1);
}
```

**Run the load test using:**

```bash
k6 run k6-load.js
```

![K6 Load Test](https://imgur.com/QG2DaBD.png)

---

## **Step 7: Monitor Pod Scaling**

During the load test, KEDA HTTP Add-on will automatically scale the number of pods. To monitor the scaling activity, run:

```bash
kubectl get pods -w -n test
```
![Pods status](https://i.imgur.com/uHcCHOA.png)
