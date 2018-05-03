KubeBurst
============
Kubernetes based platform for bursting containerized workloads into the cloud.

DO Initial Snapshot Server Setup
------------
 * Ubuntu 16.04 x64

 * Install Kubeadm
 https://kubernetes.io/docs/setup/independent/install-kubeadm/

 * Snapshot this to become base for master/workers

Master Server Setup
--------

Can just be snapshotted server *** NEEDS 2 CPU 2GB RAM **** (15 dollar one is cheapest that works)

1. $ kubeadm init --pod-network-cidr=192.168.0.0/16

2. Save the join command returned by init 

3.  > export KUBECONFIG=/etc/kubernetes/admin.conf
    >
    > kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/kubeadm/1.7/calico.yaml 
    >
    > kubectl taint nodes --all node-role.kubernetes.io/master-
    >
    > kubectl label nodes $(kubectl get nodes | tail -1 | awk '{print $1;}') kubetestrole=master

4. add to .bashrc:
    source <(kubectl completion bash)
    export KUBECONFIG=/etc/kubernetes/admin.conf

5. add required secrets:
    kubectl create secret generic dosecret --from-literal=dokey=[replace with DO API Key]




Optional to be able to run kubectl locally:

scp -i [sshkey] root@[masterip]:/etc/kubernetes/admin.conf .

Worker Snapshot Setup
--------
1. Launch base Kubeadm

2. Place scripts/joincluster.service into /etc/systemd/system

3. Replace the ExecStart= with value from Master Setup

5. Replace kubeadm in ExecStart with full path in joincluster.service ( /usr/bin/kubeadm )

4. $ systemctl enable joincluster.service    (Don't start it)

6. Save snapshot as "kubetest-workerimage"











