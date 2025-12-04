package com.ymougenel.app_api.entities
import jakarta.persistence.*
import java.time.LocalDateTime


@Entity
data class Score (
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    val id: Long?, val score: Long?, val playerName: String?, val creationDate:LocalDateTime?,) {
}